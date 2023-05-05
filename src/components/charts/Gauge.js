import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';

import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// Register the required components
echarts.use(
  [GaugeChart, CanvasRenderer]
);

function Gauge(props) {

  const option = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '66%'],
        startAngle: 180,
        endAngle: 0,
        itemStyle: {
          color: '#ea4f14'
        },
        detail: {
          formatter: '{value} %',
          offsetCenter: [0, '-25%'],
          fontSize: 16,
        },
        progress: {
          show: true,
          width: 8
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [1, '#f9e7df']
            ]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        radius: "100%",
        data: [
          {
            value: props.value ? props.value.toFixed(2) : 0,
            name: props.label
          }
        ]
      }
    ]
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      loadingOption={{ color: '#ea4f14', text: '' }}
      showLoading={props.value === undefined}
      style={{ height: '100%', width: '100%' }}
    />
  );
}

export default Gauge;