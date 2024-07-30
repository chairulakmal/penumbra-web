import type { Meta, StoryObj } from '@storybook/react';

import { Table } from '.';
import { Text } from '../Text';
import { ComponentType, PropsWithChildren, useState } from 'react';
import { Density } from '../Density';
import { ConditionalWrap } from '../utils/ConditionalWrap';
import { Tabs } from '../Tabs';
import styled from 'styled-components';

const meta: Meta<typeof Table> = {
  component: Table,
  tags: ['autodocs', '!dev'],
  subcomponents: {
    // Re: type coercion, see
    // https://github.com/storybookjs/storybook/issues/23170#issuecomment-2241802787
    'Table.Thead': Table.Thead as ComponentType<unknown>,
    'Table.Tbody': Table.Tbody as ComponentType<unknown>,
    'Table.Tr': Table.Tr as ComponentType<unknown>,
    'Table.Th': Table.Th as ComponentType<unknown>,
    'Table.Td': Table.Td as ComponentType<unknown>,
  },
};
export default meta;

type Story = StoryObj<typeof Table>;

const DATA = [
  [32768, 'Send', '9d80ffa9113f7eed74ddeff8eddfda6a89106c6cdf336565f9cbaf90810396bf'],
  [16384, 'Receive', '9d80ffa9113f7eed74ddeff8eddfda6a89106c6cdf336565f9cbaf90810396bf'],
  [8192, 'Swap Claim', '9d80ffa9113f7eed74ddeff8eddfda6a89106c6cdf336565f9cbaf90810396bf'],
  [4096, 'Swap', '9d80ffa9113f7eed74ddeff8eddfda6a89106c6cdf336565f9cbaf90810396bf'],
  [2048, 'Internal Transfer', '9d80ffa9113f7eed74ddeff8eddfda6a89106c6cdf336565f9cbaf90810396bf'],
  [1024, 'Delegate', '9d80ffa9113f7eed74ddeff8eddfda6a89106c6cdf336565f9cbaf90810396bf'],
];

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(4)};
`;

const DensityWrapper = ({ children }: PropsWithChildren) => {
  const [density, setDensity] = useState('sparse');

  return (
    <ConditionalWrap
      if={density === 'sparse'}
      then={children => <Density sparse>{children}</Density>}
      else={children => <Density compact>{children}</Density>}
    >
      <Column>
        <Tabs
          options={[
            { label: 'Sparse', value: 'sparse' },
            { label: 'Compact', value: 'compact' },
          ]}
          value={density}
          onChange={setDensity}
        />

        {children}
      </Column>
    </ConditionalWrap>
  );
};

export const Basic: Story = {
  decorators: [
    Story => (
      <DensityWrapper>
        <Story />
      </DensityWrapper>
    ),
  ],

  render: function Render() {
    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th hAlign='right'>Block height</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th width='50%'>Transaction hash</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {DATA.map(([blockHeight, description, hash]) => (
            <Table.Tr key={hash}>
              <Table.Td hAlign='right'>{blockHeight}</Table.Td>
              <Table.Td>{description}</Table.Td>
              <Table.Td>
                <Text technical>{hash}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  },
};