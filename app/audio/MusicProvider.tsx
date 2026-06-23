import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* Shared music state. One <audio> element lives here; the invitation cover
   kicks it off on the opening gesture (browsers block autoplay until a user
   interacts), and the floating toggle pauses/resumes it afterwards.

   Track: "Canon in D Major" — Kevin MacLeod (incompetech.com), CC BY 3.0.
   See /public/audio/CREDITS.txt for attribution. */

const SRC = "/audio/canon-in-d.mp3";
const TARGET_VOLUME = 0.42;
const FADE_IN_MS = 1400;
const FADE_OUT_MS = 320;

interface MusicContextValue {
  /** True while the track is audibly playing. */
  isPlaying: boolean;
  /** Begin playback from a user gesture, fading the volume up. */
  start: () => void;
  /** Pause if playing, resume if paused. */
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /* Create the element once on the client so the file preloads before the
     user opens the invitation — playback then starts without a hitch. */
  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = TARGET_VOLUME;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current);
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  /* Linearly ramp volume to a target over `ms`. Cancels any ramp in flight. */
  const fadeTo = useCallback((target: number, ms: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);

    const start = audio.volume;
    const steps = 24;
    const stepMs = ms / steps;
    let i = 0;
    fadeRef.current = window.setInterval(() => {
      i += 1;
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
      if (i >= steps) {
        if (fadeRef.current) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        onDone?.();
      }
    }, stepMs);
  }, []);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        fadeTo(TARGET_VOLUME, FADE_IN_MS);
      })
      .catch(() => {
        /* Autoplay was rejected despite the gesture — leave it paused; the
           floating toggle still lets the guest start it manually. */
      });
  }, [fadeTo]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0;
      setIsPlaying(true); // flip the button instantly; the event listener reconciles
      audio
        .play()
        .then(() => fadeTo(TARGET_VOLUME, FADE_IN_MS))
        .catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(false); // button reacts now; the short fade then actually pauses
      fadeTo(0, FADE_OUT_MS, () => audio.pause());
    }
  }, [fadeTo]);

  return (
    <MusicContext.Provider value={{ isPlaying, start, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within a MusicProvider");
  return ctx;
}
