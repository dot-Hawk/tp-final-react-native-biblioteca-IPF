import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

type Props = {
  nombre: ComponentProps<typeof Ionicons>['name'];
  color: ColorValue;
  size: number;
};

export function IconoPestania({ nombre, color, size }: Props) {
  return <Ionicons name={nombre} size={size} color={typeof color === 'string' ? color : undefined} />;
}
