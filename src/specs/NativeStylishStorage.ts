import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  getAvailableBytes(): Promise<number>;
}

export default TurboModuleRegistry.get<Spec>('NativeStylishStorage');
