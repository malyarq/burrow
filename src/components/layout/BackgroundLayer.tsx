import React from 'react';
import { useEffect, useRef, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useSettings } from '../../contexts/SettingsContext';

export const BackgroundLayer = () => {
    const { customTheme } = useSettings();
    const config = customTheme.background;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [init, setInit] = useState(false);

    // Initialize particles engine once
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // Video Auto-Pause Logic
    useEffect(() => {
        if (config?.type !== 'video' || !config.video?.autoPause || !videoRef.current) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                videoRef.current?.pause();
            } else {
                videoRef.current?.play().catch(() => { });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [config?.type, config?.video?.autoPause]);

    // Handle volume changes
    useEffect(() => {
        if (videoRef.current && config?.video?.volume !== undefined) {
            videoRef.current.volume = config.video.volume;
        }
    }, [config?.video?.volume]);


    if (!config) return null;

    const style: React.CSSProperties = {};

    if (config.type === 'video' && config.video?.url) {
        return (
            <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
                <video
                    ref={videoRef}
                    src={config.video.url}
                    autoPlay
                    loop={config.video.loop ?? true}
                    muted={config.video.volume === 0}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: config.opacity ?? 1, filter: `blur(${config.blur || 0}px)` }}
                />
                <div className="absolute inset-0 bg-background/50" />
            </div>
        );
    }

    if (config.type === 'particles' && init) {
        const particleOptions = useMemo(() => ({
            background: {
                color: {
                    value: customTheme.colors?.background || "#000000",
                },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: "#ffffff",
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: config.particles?.type === 'rain' ? "bottom" : "none",
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: false,
                    speed: config.particles?.speed || 2,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: (config.particles?.intensity || 50) * 1.5,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: config.particles?.type === 'stars' ? "star" : "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        }), [customTheme.colors?.background, config.particles]);

        return (
            <div className="fixed inset-0 -z-10 bg-background">
                <Particles
                    id="tsparticles"
                    options={particleOptions as any}
                    className="absolute inset-0"
                />
            </div>
        );
    }

    // Fallback to Image
    if (config.image) {
        style.backgroundImage = `url(${config.image})`;
    }

    if (config.position) {
        if (config.position === 'cover') {
            style.backgroundSize = 'cover';
            style.backgroundRepeat = 'no-repeat';
            style.backgroundPosition = 'center';
        } else if (config.position === 'contain') {
            style.backgroundSize = 'contain';
            style.backgroundRepeat = 'no-repeat';
            style.backgroundPosition = 'center';
        } else if (config.position === 'center') {
            style.backgroundPosition = 'center';
            style.backgroundRepeat = 'no-repeat';
        } else if (config.position === 'repeat') {
            style.backgroundRepeat = 'repeat';
        }
    } else {
        // Default legacy behavior
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
    }

    if (config.blur) {
        style.filter = `blur(${config.blur}px)`;
    }
    if (config.opacity !== undefined) {
        style.opacity = config.opacity;
    }

    return (
        <div
            className="fixed inset-0 -z-10 bg-cover bg-center transition-all duration-300 pointer-events-none"
            style={style}
            aria-hidden="true"
        />
    );
};
