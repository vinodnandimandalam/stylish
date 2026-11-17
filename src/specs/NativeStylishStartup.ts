import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  reportAppReady(): void;
}

export default TurboModuleRegistry.get<Spec>('NativeStylishStartup');
