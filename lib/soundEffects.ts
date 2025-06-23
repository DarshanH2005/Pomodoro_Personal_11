import { Howl } from 'howler';

// Define sound types
type SoundType = 'workComplete' | 'breakComplete' | 'buttonClick' | 'timerTick' | 'bell' | 'chime' | 'ding' | 'xylophone' | 'workSessionOver' | 'breakOver';

// Define sound options
interface SoundOptions {
  volume?: number;
  loop?: boolean;
  rate?: number;
}

// Generate a simple tone using Web Audio API
function generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): string {
  if (typeof window === 'undefined') return '';
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
  
  return 'generated';
}

// Create a class to manage sound effects
class SoundEffects {
  private sounds: Record<SoundType, Howl>;
  private currentSound: Howl | null = null;
  private isMuted: boolean = false;
  private audioContext: AudioContext | null = null;
  private voiceLoopInterval: NodeJS.Timeout | null = null; // Add this for voice looping

  constructor() {
    // Initialize Web Audio API
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('✅ Web Audio API initialized successfully');
        console.log('Audio context state:', this.audioContext.state);
      } catch (error) {
        console.error('❌ Failed to initialize Web Audio API:', error);
        this.audioContext = null;
      }
    } else {
      console.log('Web Audio API not available (server-side)');
    }

    // Initialize sound effects with Web Audio API fallback
    this.sounds = {
      workComplete: new Howl({
        src: ['/sounds/work-complete.mp3'],
        volume: 1.0,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for work-complete sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for work-complete sound');
        }
      }),
      breakComplete: new Howl({
        src: ['/sounds/break-complete.mp3'],
        volume: 1.0,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for break-complete sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for break-complete sound');
        }
      }),
      workSessionOver: new Howl({
        src: ['/sounds/work-complete.mp3'],
        volume: 1.0,
        preload: true
      }),
      breakOver: new Howl({
        src: ['/sounds/break-complete.mp3'],
        volume: 1.0,
        preload: true
      }),
      buttonClick: new Howl({
        src: ['/sounds/button-click.mp3'],
        volume: 0.7,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for button-click sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for button-click sound');
        }
      }),
      timerTick: new Howl({
        src: ['/sounds/timer-tick.mp3'],
        volume: 0.5,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for timer-tick sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for timer-tick sound');
        }
      }),
      bell: new Howl({
        src: ['/sounds/bell.mp3'],
        volume: 1.0,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for bell sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for bell sound');
        }
      }),
      chime: new Howl({
        src: ['/sounds/chime.mp3'],
        volume: 1.0,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for chime sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for chime sound');
        }
      }),
      ding: new Howl({
        src: ['/sounds/ding.mp3'],
        volume: 1.0,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for ding sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for ding sound');
        }
      }),
      xylophone: new Howl({
        src: ['/sounds/xylophone.mp3'],
        volume: 1.0,
        preload: true,
        onloaderror: (id, error) => {
          console.log('Using Web Audio API fallback for xylophone sound');
        },
        onplayerror: (id, error) => {
          console.log('Using Web Audio API fallback for xylophone sound');
        }
      }),
    };
    
    console.log('✅ Sound effects initialized with', Object.keys(this.sounds).length, 'sounds');
  }

  // Play a sound effect with Web Audio API as primary method
  play(type: SoundType, options: SoundOptions = {}): void {
    if (this.isMuted) {
      return;
    }

    const sound = this.sounds[type];
    if (!sound) {
      console.error(`Sound type ${type} not found`);
      return;
    }

    // Use Web Audio API as primary method since it's working reliably
    try {
      this.playWebAudioFallback(type, options);
    } catch (error) {
      console.log(`Web Audio API failed for ${type}, falling back to Howler.js`);
      
      // Fallback to Howler.js if Web Audio API fails
      try {
        // Apply options
        if (options.volume !== undefined) sound.volume(options.volume);
        if (options.rate !== undefined) sound.rate(options.rate);
        
        // Stop current sound if it's playing
        this.stop();

        // Play the sound
        const soundId = sound.play();
        
        // Set loop if specified
        if (options.loop) {
          sound.loop(true);
          this.currentSound = sound;
        }
      } catch (howlerError) {
        console.error(`Both Web Audio API and Howler failed for ${type}:`, howlerError);
      }
    }
  }

  // Web Audio API fallback for playing sounds
  private playWebAudioFallback(type: SoundType, options: SoundOptions = {}): void {
    console.log(`Attempting Web Audio API fallback for ${type}`);
    
    if (!this.audioContext) {
      console.error('Web Audio API not available');
      return;
    }

    // Resume audio context if suspended (required for autoplay policy)
    if (this.audioContext.state === 'suspended') {
      console.log('Resuming suspended audio context');
      this.audioContext.resume().then(() => {
        console.log('Audio context resumed successfully');
        this.playWebAudioTone(type, options);
      }).catch(error => {
        console.error('Failed to resume audio context:', error);
      });
    } else {
      this.playWebAudioTone(type, options);
    }
  }

  // Actually play the Web Audio tone
  private playWebAudioTone(type: SoundType, options: SoundOptions = {}): void {
    if (!this.audioContext) {
      console.error('Web Audio API not available');
      return;
    }

    const volume = options.volume || 0.5;
    let frequency = 440; // Default frequency
    let duration = 0.3; // Default duration
    let oscillatorType: OscillatorType = 'sine';

    // Define sound characteristics based on type
    switch (type) {
      case 'workComplete':
        frequency = 523; // C5
        duration = 0.8;
        oscillatorType = 'triangle';
        break;
      case 'breakComplete':
        frequency = 659; // E5
        duration = 0.6;
        oscillatorType = 'sine';
        break;
      case 'buttonClick':
        frequency = 800;
        duration = 0.1;
        oscillatorType = 'square';
        break;
      case 'timerTick':
        frequency = 1000;
        duration = 0.05;
        oscillatorType = 'sine';
        break;
      case 'bell':
        frequency = 784; // G5
        duration = 0.5;
        oscillatorType = 'triangle';
        break;
      case 'chime':
        frequency = 1047; // C6
        duration = 0.4;
        oscillatorType = 'sine';
        break;
      case 'ding':
        frequency = 523; // C5
        duration = 0.3;
        oscillatorType = 'sine';
        break;
      case 'xylophone':
        frequency = 659; // E5
        duration = 0.4;
        oscillatorType = 'triangle';
        break;
      case 'workSessionOver':
        // Simple voice-like notification: "Work session over" (3 tones)
        this.playVoiceNotification('workSessionOver', volume);
        return;
      case 'breakOver':
        // Simple voice-like notification: "Break over" (2 tones)
        this.playVoiceNotification('breakOver', volume);
        return;
    }

    console.log(`Playing ${type}: ${frequency}Hz, ${duration}s, ${oscillatorType} wave, volume: ${volume}`);

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = oscillatorType;
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
      console.log(`✅ Web Audio API sound ${type} played successfully`);
    } catch (error) {
      console.error(`❌ Failed to play Web Audio API sound ${type}:`, error);
    }
  }

  // Stop the current sound
  stop(): void {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound = null;
    }
    // Stop voice loop if running
    if (this.voiceLoopInterval) {
      clearInterval(this.voiceLoopInterval);
      this.voiceLoopInterval = null;
      console.log('✅ Voice notification loop stopped');
    }
  }

  // Stop all sounds
  stopAll(): void {
    Object.values(this.sounds).forEach(sound => sound.stop());
    this.currentSound = null;
    // Stop voice loop if running
    if (this.voiceLoopInterval) {
      clearInterval(this.voiceLoopInterval);
      this.voiceLoopInterval = null;
      console.log('✅ Voice notification loop stopped');
    }
  }

  // Mute/unmute all sounds
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopAll();
    }
    
    return this.isMuted;
  }

  // Set mute state
  setMute(mute: boolean): void {
    this.isMuted = mute;
    
    if (this.isMuted) {
      this.stopAll();
    }
  }

  // Check if sound is muted
  getMuteState(): boolean {
    return this.isMuted;
  }

  // Play notification sound (looping until confirmed)
  playNotification(type: 'workComplete' | 'breakComplete' | 'workSessionOver' | 'breakOver'): void {
    this.play(type, { loop: true, volume: 1.0 });
  }

  // Play simple voice-like notification using tone sequences
  private playVoiceNotification(type: 'workSessionOver' | 'breakOver', volume: number = 0.8): void {
    if (!this.audioContext) {
      console.error('Web Audio API not available for voice notification');
      return;
    }

    // Clear any existing voice loop
    if (this.voiceLoopInterval) {
      clearInterval(this.voiceLoopInterval);
      this.voiceLoopInterval = null;
    }

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        this.startVoiceLoop(type, volume);
      }).catch(error => {
        console.error('Failed to resume audio context for voice notification:', error);
      });
    } else {
      this.startVoiceLoop(type, volume);
    }
  }

  // Start the voice loop
  private startVoiceLoop(type: 'workSessionOver' | 'breakOver', volume: number): void {
    // Play immediately
    this.playVoiceTones(type, volume);
    
    // Calculate total duration for the voice sequence
    const tones = type === 'workSessionOver' 
      ? [
          { freq: 523, duration: 0.3 }, // C5 - "Work"
          { freq: 659, duration: 0.3 }, // E5 - "ses"
          { freq: 784, duration: 0.4 }  // G5 - "sion"
        ]
      : [
          { freq: 659, duration: 0.3 }, // E5 - "Break"
          { freq: 784, duration: 0.4 }  // G5 - "over"
        ];
    
    const totalDuration = tones.reduce((sum, tone) => sum + tone.duration + 0.1, 0);
    
    // Set up the loop interval
    this.voiceLoopInterval = setInterval(() => {
      this.playVoiceTones(type, volume);
    }, totalDuration * 1000); // Convert to milliseconds
    
    console.log(`✅ Voice notification ${type} loop started (repeats every ${totalDuration.toFixed(1)}s)`);
  }

  // Play the actual voice tone sequences
  private playVoiceTones(type: 'workSessionOver' | 'breakOver', volume: number): void {
    if (!this.audioContext) return;

    const tones = type === 'workSessionOver' 
      ? [
          { freq: 523, duration: 0.3 }, // C5 - "Work"
          { freq: 659, duration: 0.3 }, // E5 - "ses"
          { freq: 784, duration: 0.4 }  // G5 - "sion"
        ]
      : [
          { freq: 659, duration: 0.3 }, // E5 - "Break"
          { freq: 784, duration: 0.4 }  // G5 - "over"
        ];

    let currentTime = this.audioContext.currentTime;

    tones.forEach((tone, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(tone.freq, currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + tone.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + tone.duration);
      
      currentTime += tone.duration + 0.1; // Small gap between tones
    });

    console.log(`✅ Voice notification ${type} played successfully`);
  }
}

// Create a singleton instance
let instance: SoundEffects;

export function getSoundEffects(): SoundEffects {
  if (!instance) {
    instance = new SoundEffects();
  }
  return instance;
}