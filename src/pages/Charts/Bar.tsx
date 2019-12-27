import React, { memo, useCallback } from 'react';
import { Card, Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import './Bar.less';

interface IBarProps {}

const Bar: React.FunctionComponent<IBarProps> = (props: IBarProps) => {
  const title = (
    <Button
      type={'primary'}
      onClick={() => {
        console.log(`update clicked`);
      }}
    >
      Update
    </Button>
  );
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
          type: 'bar',
        },
        {
          name: 'Player Number',
          data: [20, 9, 21, 12],
          type: 'bar',
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

export default memo(Bar);
