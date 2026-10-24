import React from 'react';
import { useScan } from './core/state/ScanContext';
import { CyberBackground } from './ui/components/CyberBackground';
import { CyberNavBar } from './ui/components/CyberNavBar';
import { WindowsTitleBar } from './ui/components/WindowsTitleBar';

import { HomeScreen } from './ui/screens/HomeScreen';
import { QuickScanScreen } from './ui/screens/QuickScanScreen';
import { CustomScanScreen } from './ui/screens/CustomScanScreen';
import { TestIpsScreen } from './ui/screens/TestIpsScreen';
import { DiscoverScreen } from './ui/screens/DiscoverScreen';
import { LiveScanScreen } from './ui/screens/LiveScanScreen';
import { ResultsScreen } from './ui/screens/ResultsScreen';
import { VpnScreen } from './ui/screens/VpnScreen';
import { DnsScreen } from './ui/screens/DnsScreen';
import { SpeedTestScreen } from './ui/screens/SpeedTestScreen';
import { SplitTunnelScreen } from './ui/screens/SplitTunnelScreen';
import { AboutScreen } from './ui/screens/AboutScreen';

export const App: React.FC = () => {
  const { route } = useScan();

  const renderScreen = () => {
    switch (route) {
      case 'HOME':
        return <HomeScreen />;
      case 'QUICK':
        return <QuickScanScreen />;
      case 'CUSTOM':
        return <CustomScanScreen />;
      case 'TEST':
        return <TestIpsScreen />;
      case 'DISCOVER':
        return <DiscoverScreen />;
      case 'LIVE':
        return <LiveScanScreen />;
      case 'RESULTS':
        return <ResultsScreen />;
      case 'VPN':
        return <VpnScreen />;
      case 'DNS':
        return <DnsScreen />;
      case 'SPEEDTEST':
        return <SpeedTestScreen />;
      case 'SPLIT_TUNNEL':
        return <SplitTunnelScreen />;
      case 'ABOUT':
        return <AboutScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isNavBarVisible = route !== 'LIVE';

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0D12]">
      {/* Windows Native Title Bar Frame */}
      <WindowsTitleBar />

      {/* Cyber Background and Main Screen Viewport */}
      <CyberBackground animated={route === 'HOME' || route === 'LIVE' || route === 'VPN'}>
        <main className="flex-1 w-full animate-fade-in">
          {renderScreen()}
        </main>
      </CyberBackground>

      {/* Cyber Dock Navigation Bar */}
      {isNavBarVisible && <CyberNavBar />}
    </div>
  );
};
