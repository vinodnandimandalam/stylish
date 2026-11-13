import React from 'react';
import {Platform, Text} from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import Settings from '../src/modules/settings/Settings';
import NativeStylishStorage from '../src/specs/NativeStylishStorage';
import {strings} from '../src/constants/strings';

jest.mock('../src/components', () => ({AppButton: () => null}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
}));
jest.mock('../src/store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => null,
}));
jest.mock('../src/store/authSlice', () => ({
  clearLogoutError: jest.fn(),
  logout: jest.fn(),
}));
jest.mock('../src/specs/NativeStylishDeviceInfo', () => ({
  __esModule: true,
  default: {getDeviceModel: jest.fn().mockResolvedValue('Test device')},
}));
jest.mock('../src/specs/NativeStylishStorage', () => ({
  __esModule: true,
  default: {getAvailableBytes: jest.fn()},
}));

const getAvailableBytes = jest.mocked(NativeStylishStorage!.getAvailableBytes);
const originalOS = Platform.OS;

const textContent = (renderer: ReactTestRenderer.ReactTestRenderer): string =>
  renderer.root
    .findAllByType(Text)
    .map(node => JSON.stringify(node.props.children))
    .join(' ');

beforeEach(() => {
  Platform.OS = 'android';
  getAvailableBytes.mockReset();
});

afterAll(() => {
  Platform.OS = originalOS;
});

test('shows available storage and warns below one GiB', async () => {
  getAvailableBytes.mockResolvedValue(512 * 1024 * 1024);
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Settings />);
  });

  expect(textContent(renderer)).toContain('512.0 MiB');
  expect(textContent(renderer)).toContain(strings.storageLowWarning);
  ReactTestRenderer.act(() => renderer.unmount());
});

test('does not warn when exactly one GiB is available', async () => {
  getAvailableBytes.mockResolvedValue(1024 * 1024 * 1024);
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Settings />);
  });

  expect(textContent(renderer)).toContain('1.0 GiB');
  expect(textContent(renderer)).not.toContain(strings.storageLowWarning);
  ReactTestRenderer.act(() => renderer.unmount());
});

test('shows an error and refreshes successfully', async () => {
  getAvailableBytes
    .mockRejectedValueOnce(new Error('Storage unavailable'))
    .mockResolvedValueOnce(2 * 1024 * 1024 * 1024);
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Settings />);
  });

  expect(textContent(renderer)).toContain(strings.storageError);

  await ReactTestRenderer.act(async () => {
    renderer.root.find(
      node => node.props.accessibilityRole === 'button',
    ).props.onPress();
  });

  expect(getAvailableBytes).toHaveBeenCalledTimes(2);
  expect(textContent(renderer)).toContain('2.0 GiB');
  expect(textContent(renderer)).not.toContain(strings.storageLowWarning);
  ReactTestRenderer.act(() => renderer.unmount());
});

test('does not call the Android module on other platforms', async () => {
  Platform.OS = 'ios';
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Settings />);
  });

  expect(getAvailableBytes).not.toHaveBeenCalled();
  expect(textContent(renderer)).toContain(strings.storageUnavailable);
  ReactTestRenderer.act(() => renderer.unmount());
});
