export default function ChartStyles() {
  return (
    <style jsx>{`
      .range-slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #17a2b8;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }

      .range-slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #17a2b8;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }

      .range-slider::-webkit-slider-track {
        background: transparent;
      }

      .range-slider::-moz-range-track {
        background: transparent;
      }

      .photo-range-slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        border: none;
      }

      .photo-range-slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        border: none;
      }

      .photo-range-slider::-webkit-slider-track {
        background: transparent;
      }

      .photo-range-slider::-moz-range-track {
        background: transparent;
      }

      .compact-range-slider::-webkit-slider-thumb {
        appearance: none;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: #64748b;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        opacity: 0;
      }

      .compact-range-slider::-moz-range-thumb {
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: #64748b;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        opacity: 0;
      }

      .compact-range-slider::-webkit-slider-track {
        background: transparent;
      }

      .compact-range-slider::-moz-range-track {
        background: transparent;
      }

      .compact-range-slider:hover::-webkit-slider-thumb {
        opacity: 0.3;
      }

      .compact-range-slider:hover::-moz-range-thumb {
        opacity: 0.3;
      }
    `}</style>
  )
}
