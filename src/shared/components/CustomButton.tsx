import type { ComponentProps } from 'react';
import { Button } from 'react-native';

type CustomButtonProps = ComponentProps<typeof Button>;

export const CustomButton = (props: CustomButtonProps) => <Button {...props} />;
