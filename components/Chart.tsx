import { getDashboardWidgets } from "@/constants/getDashboardWidgets";
import { convertFileSize } from "@/lib/utils";

const TOTAL_STORAGE = 100 * 1024 * 1024;

const Chart = ({ files }: { files: FileDocument[] }) => {
  const usedStorage = getDashboardWidgets(files).reduce(
    (total, widget) => total + widget.size,
    0,
  );
  const usedPercentage = Math.min(
    Math.round((usedStorage / TOTAL_STORAGE) * 100),
    100,
  );

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (usedPercentage / 100);
  const gap = circumference - progress;
  const trackGap = circumference * 0.19;

  return (
    <section className="chart">
      <div className="chart-container">
        <svg viewBox="0 0 200 200" className="size-full">
          <defs>
            <filter
              id="storage-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="12"
                stdDeviation="10"
                floodColor="#D94E54"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          <circle
            cx="100"
            cy="100"
            r="56"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            strokeDasharray="1 4"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeDasharray={`${circumference - trackGap} ${trackGap}`} //439.88 - 57.1844
            transform="rotate(123.5 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="22"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${gap}`}
            transform="rotate(123.5 100 100)"
            filter="url(#storage-shadow)"
          />

          <text
            x="100"
            y="94"
            textAnchor="middle"
            className="chart-total-percentage"
          >
            {usedPercentage}%
          </text>
          <text
            x="100"
            y="122"
            textAnchor="middle"
            className="fill-white text-base font-semibold"
          >
            Space used
          </text>
        </svg>
      </div>

      <div className="chart-details">
        <h2 className="chart-title">Available Storage</h2>
        <p className="chart-description">
          {convertFileSize(usedStorage, 0)} /{" "}
          {convertFileSize(TOTAL_STORAGE, 0)}
        </p>
      </div>
    </section>
  );
};

export default Chart;
