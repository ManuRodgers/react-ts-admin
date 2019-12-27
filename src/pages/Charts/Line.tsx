import React, { memo, useCallback } from 'react';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';

import './Line.less';

interface ILineProps {}

const Line: React.FunctionComponent<ILineProps> = (props: ILineProps) => {
  const getOption = useCallback(() => {
    return {
      title: {
        text: 'Player',
      },
      legend: {
        data: ['Player Salary(Unit: $US Million)', 'Player Number'],
      },
      xAxis: {
        type: 'category',
        data: ['Manu', 'Tony', 'Tim', 'Arron'],
      },
      yAxis: {
        type: 'value',
      },
      axisPointer: {},
      series: [
        {
          name: 'Player Salary(Unit: $US Million)',
          data: [14, 12, 20, 40],
          type: 'line',
        },
        {
          name: 'Player Number',
          data: [20, 9, 21, 12],
          type: 'line',
        },
      ],
    };
  }, []);
  return (
    <Card className={`home`}>
      <ReactEcharts option={getOption()} />
    </Card>
  );
};

export default memo(Line);
