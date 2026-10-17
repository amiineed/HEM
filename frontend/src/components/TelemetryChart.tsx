import React, { useState } from 'react';
import { HourlyTelemetryPoint } from '../data/mockData';
import { AlertTriangle, Thermometer, Wind, Zap } from 'lucide-react';

interface TelemetryChartProps {
  data: HourlyTelemetryPoint[];
  selectedBuildingName: string;
  isDemoMode: boolean;
  peakCo2Simulated: boolean;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  selectedBuildingName,
  isDemoMode,
  peakCo2Simulated,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number>(11); // Default highlight at 14:15 peak
  const [chartMode, setChartMode] = useState<'dual' | 'energy'>('dual');

  if (!data?.length) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs text-slate-400 shadow-xs">
        Aucune mesure disponible pour ce graphique.
      </div>
    );
  }

  const width = 760;
  const height = 270;
  const padLeft = 46;
  const padRight = 50;
  const padTop = 24;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  // Temperature scale: 14°C to 22°C
  const minTemp = 14;
  const maxTemp = 22;
  const getTempY = (t: number) =>
    padTop + plotH - ((Math.min(maxTemp, Math.max(minTemp, t)) - minTemp) / (maxTemp - minTemp)) * plotH;

  // CO2 scale: 350 ppm to 1400 ppm
  const minCo2 = 350;
  const maxCo2 = 1400;
  const getCo2Y = (ppm: number) =>
    padTop + plotH - ((Math.min(maxCo2, Math.max(minCo2, ppm)) - minCo2) / (maxCo2 - minCo2)) * plotH;

  // Energy scale: 40 kW to 260 kW
  const minKw = 40;
  const maxKw = 260;
  const getKwY = (kw: number) =>
    padTop + plotH - ((Math.min(maxKw, Math.max(minKw, kw)) - minKw) / (maxKw - minKw)) * plotH;

  const getX = (index: number) =>
    padLeft + (index / Math.max(1, data.length - 1)) * plotW;

  const computedPoints = data.map((pt, idx) => {
    const co2Val = peakCo2Simulated ? pt.co2SchoolPeak : pt.co2Ppm;
    const tempVal = isDemoMode ? pt.tempMeasured : Number((pt.tempMeasured - 0.1).toFixed(1));
    return {
      ...pt,
      co2Active: co2Val,
      tempActive: tempVal,
      x: getX(idx),
      tempY: getTempY(tempVal),
      targetY: getTempY(pt.tempTarget),
      co2Y: getCo2Y(co2Val),
      kwY: getKwY(pt.powerKw),
      baseKwY: getKwY(pt.baselineKw),
    };
  });

  const tempPath = computedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.tempY.toFixed(1)}`)
    .join(' ');

  const targetPath = computedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.targetY.toFixed(1)}`)
    .join(' ');

  const co2Path = computedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.co2Y.toFixed(1)}`)
    .join(' ');

  const co2AreaPath = `${co2Path} L ${computedPoints[computedPoints.length - 1].x.toFixed(1)} ${(
    padTop + plotH
  ).toFixed(1)} L ${computedPoints[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  const kwPath = computedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.kwY.toFixed(1)}`)
    .join(' ');

  const baseKwPath = computedPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.baseKwY.toFixed(1)}`)
    .join(' ');

  const kwSavingsArea = `${baseKwPath} L ${[...computedPoints]
    .reverse()
    .map((p) => `${p.x.toFixed(1)} ${p.kwY.toFixed(1)}`)
    .join(' L ')} Z`;

  const criticalY1000 = getCo2Y(1000);
  const warningY800 = getCo2Y(800);
  const safeHoveredIdx = Math.min(Math.max(hoveredIdx, 0), computedPoints.length - 1);
  const activePoint = computedPoints[safeHoveredIdx] ?? computedPoints[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Télémétrie Temps Réel 24h — {selectedBuildingName}
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              Pas de 15 min • CSV / LoRaWAN
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Corrélation thermique (°C vs consigne État 19°C) et confinement d’air intérieur (seuil d’alerte sanitaire CO₂ &gt; 1000 ppm)
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setChartMode('dual')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              chartMode === 'dual'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Température & CO₂ (ppm)
          </button>
          <button
            type="button"
            onClick={() => setChartMode('energy')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              chartMode === 'energy'
                ? 'bg-white text-emerald-700 shadow-2xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Puissance Chauffage (-30% Obj.)
          </button>
        </div>
      </div>

      {/* Legend & Live Point Readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 mb-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
        {chartMode === 'dual' ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-3 h-0.5 bg-blue-600 inline-block rounded-full" />
              <Thermometer className="w-3.5 h-3.5 text-blue-600" />
              Temp. Mesurée (°C)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-emerald-600 inline-block" />
              Consigne Éco (19.0°C / 15.5°C)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <Wind className="w-3.5 h-3.5 text-red-600" />
              Concentration CO₂ (ppm)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-medium">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              Seuil Critique : 1 000 ppm
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-slate-400 inline-block" />
              Référence Hiver 2022 (kW)
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-3 h-1 bg-emerald-600 inline-block rounded-full" />
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Puissance Pilotée 2023 (Gain -26.4% à -31.2%)
            </span>
          </div>
        )}

        {/* Hovered Point Readout */}
        <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
          <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-semibold">
            {activePoint.hour}
          </span>
          <span className="text-blue-700 font-semibold">
            {activePoint.tempActive.toFixed(1)}°C{' '}
            <span className="text-slate-400 font-normal">(Cons. {activePoint.tempTarget.toFixed(1)}°C)</span>
          </span>
          <span
            className={`px-2 py-0.5 rounded font-semibold ${
              activePoint.co2Active > 1000
                ? 'bg-red-100 text-red-700 border border-red-300'
                : activePoint.co2Active >= 800
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {activePoint.co2Active} ppm CO₂
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[255px] select-none overflow-visible"
        >
          <defs>
            <linearGradient id="co2AreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.22" />
              <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="emeraldSavingsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[14, 16, 18, 20, 22].map((tempTick) => {
            const y = getTempY(tempTick);
            return (
              <g key={tempTick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />
                {chartMode === 'dual' && (
                  <text
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-blue-600 text-[10px] font-mono"
                  >
                    {tempTick}°C
                  </text>
                )}
              </g>
            );
          })}

          {chartMode === 'dual' ? (
            <>
              {/* Right Axis CO2 labels */}
              {[400, 700, 1000, 1300].map((co2Tick) => {
                const y = getCo2Y(co2Tick);
                const isCrit = co2Tick === 1000;
                return (
                  <text
                    key={co2Tick}
                    x={width - padRight + 8}
                    y={y + 3}
                    textAnchor="start"
                    className={`text-[10px] font-mono ${
                      isCrit ? 'fill-red-600 font-bold' : 'fill-slate-500'
                    }`}
                  >
                    {co2Tick}
                  </text>
                );
              })}

              {/* Critical 1000 ppm horizontal threshold line */}
              <rect
                x={padLeft}
                y={padTop}
                width={plotW}
                height={Math.max(0, criticalY1000 - padTop)}
                fill="#FEF2F2"
                opacity="0.55"
              />
              <line
                x1={padLeft}
                y1={criticalY1000}
                x2={width - padRight}
                y2={criticalY1000}
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x={padLeft + 8}
                y={criticalY1000 - 5}
                className="fill-red-600 text-[10px] font-semibold"
              >
                ALERTE CRITIQUE CO₂ &gt; 1000 ppm (Ventilation requise)
              </text>

              {/* Warning 800 ppm threshold line */}
              <line
                x1={padLeft}
                y1={warningY800}
                x2={width - padRight}
                y2={warningY800}
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity="0.7"
              />

              {/* CO2 Shaded Area & Line */}
              <path d={co2AreaPath} fill="url(#co2AreaGrad)" />
              <path
                d={co2Path}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Heating Setpoint (Consigne) Emerald Dashed Line */}
              <path
                d={targetPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Measured Temperature Blue Line */}
              <path
                d={tempPath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              {/* Energy kW Mode */}
              {[60, 120, 180, 240].map((kwTick) => {
                const y = getKwY(kwTick);
                return (
                  <text
                    key={kwTick}
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-500 text-[10px] font-mono"
                  >
                    {kwTick}kW
                  </text>
                );
              })}
              <path d={kwSavingsArea} fill="url(#emeraldSavingsGrad)" />
              <path
                d={baseKwPath}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              <path
                d={kwPath}
                fill="none"
                stroke="#059669"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <text
                x={padLeft + 12}
                y={padTop + 16}
                className="fill-emerald-700 text-[11px] font-semibold"
              >
                Zone verte : Économie directe de gaz/électricité (-28.4% moyen sur 24h)
              </text>
            </>
          )}

          {/* Active Vertical Cursor Line */}
          <line
            x1={activePoint.x}
            y1={padTop}
            x2={activePoint.x}
            y2={padTop + plotH}
            stroke="#64748B"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Interactive Data Points */}
          {computedPoints.map((pt, idx) => {
            const isHovered = idx === hoveredIdx;
            const isCriticalCo2 = pt.co2Active > 1000;
            return (
              <g
                key={pt.hour}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setHoveredIdx(idx)}
              >
                {/* Invisible hit column */}
                <rect
                  x={pt.x - plotW / data.length / 2}
                  y={padTop}
                  width={plotW / data.length}
                  height={plotH}
                  fill="transparent"
                />

                {chartMode === 'dual' ? (
                  <>
                    {/* Temperature Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.tempY}
                      r={isHovered ? 5 : 3}
                      className="fill-blue-600 stroke-white stroke-2 transition-all"
                    />
                    {/* CO2 Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.co2Y}
                      r={isHovered ? 5.5 : isCriticalCo2 ? 4.5 : 3}
                      className={`${
                        isCriticalCo2
                          ? 'fill-red-600 stroke-red-100 stroke-2'
                          : pt.co2Active >= 800
                          ? 'fill-amber-500 stroke-white stroke-2'
                          : 'fill-emerald-500 stroke-white stroke-1'
                      }`}
                    />
                  </>
                ) : (
                  <>
                    <circle
                      cx={pt.x}
                      cy={pt.kwY}
                      r={isHovered ? 5 : 3.5}
                      className="fill-emerald-600 stroke-white stroke-2"
                    />
                  </>
                )}

                {/* X-axis Hour labels */}
                {idx % 2 === 0 && (
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    className={`text-[10px] font-mono ${
                      isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-500'
                    }`}
                  >
                    {pt.hour}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
