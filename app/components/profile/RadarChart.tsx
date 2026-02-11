import { useState } from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import type { DimensionScore } from '~/types/profile';
import { dimensions } from '~/data/dimensions';

interface RadarChartProps {
  scores: DimensionScore[];
  /** Ghost overlay of previous scores (dashed teal outline) */
  previousScores?: DimensionScore[];
  /** Feedback scores overlay (amber outline) */
  feedbackScores?: Record<string, number>;
}

export function RadarChart({ scores, previousScores, feedbackScores }: RadarChartProps) {
  const [visible, setVisible] = useState({
    current: true,
    previous: true,
    feedback: true,
  });

  const toggle = (key: keyof typeof visible) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const data = dimensions.map((dim) => {
    const score = scores.find((s) => s.dimensionId === dim.id);
    const prevScore = previousScores?.find((s) => s.dimensionId === dim.id);
    return {
      shortName: dim.name.split(' ')[0],
      value: score?.score ?? 50,
      ...(previousScores ? { previous: prevScore?.score ?? 50 } : {}),
      ...(feedbackScores ? { feedback: feedbackScores[dim.id] ?? 50 } : {}),
    };
  });

  return (
    <div className="w-full max-w-95 aspect-square mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="60%">
          <PolarGrid stroke="#E7E5E4" strokeWidth={1} />
          <PolarAngleAxis dataKey="shortName" tick={{ fill: '#A8A29E', fontSize: 13, fontWeight: 400 }} />
          {/* Ghost: previous scores (dashed teal) */}
          {previousScores && (
            <Radar
              dataKey="previous"
              stroke="#0D9488"
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeOpacity={visible.previous ? 0.4 : 0}
            />
          )}
          {/* Feedback scores (amber) */}
          {feedbackScores && (
            <Radar
              dataKey="feedback"
              stroke={visible.feedback ? '#D97706' : 'transparent'}
              fill={visible.feedback ? 'rgba(217, 119, 6, 0.08)' : 'transparent'}
              strokeWidth={1.5}
            />
          )}
          {/* Current scores (filled teal) */}
          <Radar
            dataKey="value"
            stroke={visible.current ? '#0D9488' : 'transparent'}
            fill={visible.current ? 'rgba(13, 148, 136, 0.15)' : 'transparent'}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      {/* Toggleable legend */}
      {(previousScores || feedbackScores) && (
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-ink-muted">
          <button
            type="button"
            onClick={() => toggle('current')}
            className={`flex items-center gap-1.5 transition-opacity ${visible.current ? 'opacity-100' : 'opacity-40 line-through'}`}
          >
            <span className="w-3 h-0.5 bg-[#0D9488] rounded" />
            Current
          </button>
          {previousScores && (
            <button
              type="button"
              onClick={() => toggle('previous')}
              className={`flex items-center gap-1.5 transition-opacity ${visible.previous ? 'opacity-100' : 'opacity-40 line-through'}`}
            >
              <span
                className="w-3 h-0.5 bg-[#0D9488] opacity-40 rounded"
                style={{ borderBottom: '1.5px dashed #0D9488' }}
              />
              Previous
            </button>
          )}
          {feedbackScores && (
            <button
              type="button"
              onClick={() => toggle('feedback')}
              className={`flex items-center gap-1.5 transition-opacity ${visible.feedback ? 'opacity-100' : 'opacity-40 line-through'}`}
            >
              <span className="w-3 h-0.5 bg-[#D97706] rounded" />
              Others
            </button>
          )}
        </div>
      )}
    </div>
  );
}
