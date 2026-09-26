import React from 'react';
import { Compass, Eye, Gauge, Activity, ShieldCheck, Crosshair } from 'lucide-react';
import { TelemetryData } from './CharacterCanvas';

interface CompassControlsProps {
  telemetry: TelemetryData;
  activeTarget: number | null;
  onSelectTarget: (frameIndex: number | null) => void;
  showDeadzoneVisualizer: boolean;
  onToggleDeadzone: () => void;
}

// 8 Compass Direction mappings to frame indices (0..63)
const COMPASS_POINTS = [
  { label: 'N', name: 'Up', frame: 48, deg: 270 },
  { label: 'NE', name: 'Up-Right', frame: 56, deg: 315 },
  { label: 'E', name: 'Right', frame: 0, deg: 0 },
  { label: 'SE', name: 'Down-Right', frame: 8, deg: 45 },
  { label: 'S', name: 'Down', frame: 16, deg: 90 },
  { label: 'SW', name: 'Down-Left', frame: 24, deg: 135 },
  { label: 'W', name: 'Left', frame: 32, deg: 180 },
  { label: 'NW', name: 'Up-Left', frame: 40, deg: 225 },
];

export const CompassControls: React.FC<CompassControlsProps> = ({
  telemetry,
  activeTarget,
  onSelectTarget,
  showDeadzoneVisualizer,
  onToggleDeadzone,
}) => {
  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Real-time Telemetry HUD Panel */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#F5F0EB]/90">
              Interactive Telemetry
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono-code text-emerald-400">
              {telemetry.fps} FPS · 0-GHOSTING
            </span>
          </div>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Status */}
          <div className="bg-[#181310]/80 rounded-xl p-2.5 border border-white/5 flex flex-col">
            <span className="text-[9px] font-mono-code text-white/40 uppercase tracking-wider mb-1">
              Gaze State
            </span>
            <div className="flex items-center space-x-1.5 mt-auto">
              {telemetry.isEyeContact ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#F3E5AB] animate-pulse" />
                  <span className="text-xs font-mono-code font-semibold text-[#F3E5AB] truncate">
                    Eye Contact
                  </span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-xs font-mono-code text-[#F5F0EB] truncate">
                    {telemetry.compass.name}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Frame Index */}
          <div className="bg-[#181310]/80 rounded-xl p-2.5 border border-white/5 flex flex-col">
            <span className="text-[9px] font-mono-code text-white/40 uppercase tracking-wider mb-1">
              Crisp Frame
            </span>
            <div className="flex items-baseline space-x-1 mt-auto">
              <span className="text-xs font-mono-code font-bold text-[#F3E5AB]">
                {telemetry.isEyeContact ? 'CENTER' : `F#${telemetry.frameIndex}`}
              </span>
              <span className="text-[9px] font-mono-code text-white/40">
                {telemetry.isEyeContact ? '(Neutral)' : '/64'}
              </span>
            </div>
          </div>

          {/* Angle */}
          <div className="bg-[#181310]/80 rounded-xl p-2.5 border border-white/5 flex flex-col">
            <span className="text-[9px] font-mono-code text-white/40 uppercase tracking-wider mb-1">
              Cursor Vector
            </span>
            <div className="flex items-baseline space-x-1 mt-auto">
              <span className="text-xs font-mono-code font-bold text-[#F5F0EB]">
                {telemetry.angleDeg}°
              </span>
              <span className="text-[9px] font-mono-code text-white/40">
                ({telemetry.angleRad} rad)
              </span>
            </div>
          </div>

          {/* Response Latency */}
          <div className="bg-[#181310]/80 rounded-xl p-2.5 border border-white/5 flex flex-col">
            <span className="text-[9px] font-mono-code text-white/40 uppercase tracking-wider mb-1">
              Lerp Response
            </span>
            <div className="flex items-baseline space-x-1 mt-auto">
              <span className="text-xs font-mono-code font-bold text-emerald-400">~35ms</span>
              <span className="text-[9px] font-mono-code text-white/40">(k=0.26)</span>
            </div>
          </div>
        </div>

        {/* Deadzone Visualizer Toggle */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-code">
          <button
            onClick={onToggleDeadzone}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              showDeadzoneVisualizer
                ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#F3E5AB]'
                : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Deadzone Reticle (12%)</span>
          </button>

          <span className="text-[10px] text-white/40 hidden sm:inline">
            Direct gaze within face radius
          </span>
        </div>
      </div>

      {/* 8-Directional Interactive Compass Dial */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#C5A059]">
            8-Directional Gaze Controller
          </span>
          <span className="text-[10px] font-mono-code text-white/40">
            Click pose or move cursor freely
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-9 gap-1.5">
          {COMPASS_POINTS.map((pt) => {
            const isActive =
              activeTarget === pt.frame ||
              (activeTarget === null &&
                !telemetry.isEyeContact &&
                Math.abs(telemetry.frameIndex - pt.frame) <= 3);

            return (
              <button
                key={pt.label}
                onClick={() => onSelectTarget(pt.frame)}
                title={`${pt.name} (${pt.deg}°) - Frame ${pt.frame}`}
                className={`py-2 px-1 rounded-xl text-center font-mono-code transition-all duration-200 border ${
                  isActive
                    ? 'border-[#C5A059] bg-[#C5A059]/25 text-[#F3E5AB] scale-105 shadow-md shadow-[#C5A059]/20'
                    : 'border-white/5 bg-[#140F0C]/60 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold">{pt.label}</div>
                <div className="text-[8px] opacity-50 truncate">{pt.name}</div>
              </button>
            );
          })}

          {/* Center Neutral Button */}
          <button
            onClick={() => onSelectTarget(null)}
            title="Center Neutral Direct Eye Contact"
            className={`py-2 px-1 rounded-xl text-center font-mono-code transition-all duration-200 border ${
              telemetry.isEyeContact || activeTarget === null
                ? 'border-[#C5A059] bg-[#C5A059]/20 text-[#F3E5AB]'
                : 'border-white/5 bg-[#140F0C]/60 text-white/70 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="text-[11px] font-bold">CTR</div>
            <div className="text-[8px] opacity-50">Direct</div>
          </button>
        </div>
      </div>
    </div>
  );
};
