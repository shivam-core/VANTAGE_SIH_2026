import { useState } from 'react';
import { Shield, Settings2, Bell, Database, Key } from 'lucide-react';
import { useVantage } from '../storage/store';

export default function SettingsPage() {
  const { settings, setSettings } = useVantage();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    setSettings(localSettings);
    // Could add a toast notification here
  };

  const handleCancel = () => {
    setLocalSettings(settings);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your workspace configuration, scanner preferences, and notifications.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-lg font-medium text-left">
            <Settings2 size={18} /> General
          </button>
          <button className="flex items-center gap-3 px-4 py-3 hover:bg-[#222] text-gray-400 rounded-lg font-medium text-left transition-colors">
            <Database size={18} /> Scanner Rules
          </button>
          <button className="flex items-center gap-3 px-4 py-3 hover:bg-[#222] text-gray-400 rounded-lg font-medium text-left transition-colors">
            <Shield size={18} /> Compliance
          </button>
          <button className="flex items-center gap-3 px-4 py-3 hover:bg-[#222] text-gray-400 rounded-lg font-medium text-left transition-colors">
            <Bell size={18} /> Notifications
          </button>
          <button className="flex items-center gap-3 px-4 py-3 hover:bg-[#222] text-gray-400 rounded-lg font-medium text-left transition-colors">
            <Key size={18} /> API Keys
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-[#333]">General Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Workspace Name</label>
              <input 
                type="text" 
                value={localSettings.workspaceName}
                onChange={(e) => setLocalSettings({ ...localSettings, workspaceName: e.target.value })}
                className="w-full bg-[#222] border border-[#444] rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target PQC Migration Date</label>
              <input 
                type="date" 
                value={localSettings.targetPqcDate}
                onChange={(e) => setLocalSettings({ ...localSettings, targetPqcDate: e.target.value })}
                className="w-full bg-[#222] border border-[#444] rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">This date will be used to calculate risk urgency across your inventory.</p>
            </div>

            <div className="pt-6 border-t border-[#333]">
              <h3 className="text-lg font-medium mb-4">Scanner Behavior</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-200">Deep Dependency Analysis</h4>
                  <p className="text-xs text-gray-400">Resolve transitive dependencies during scans (may increase scan time)</p>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full relative cursor-pointer ${localSettings.deepAnalysis ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setLocalSettings({ ...localSettings, deepAnalysis: !localSettings.deepAnalysis })}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localSettings.deepAnalysis ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-200">Ignore Test Directories</h4>
                  <p className="text-xs text-gray-400">Exclude /tests, /spec, and mock files from cryptographic inventory</p>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full relative cursor-pointer ${localSettings.ignoreTestDirs ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setLocalSettings({ ...localSettings, ignoreTestDirs: !localSettings.ignoreTestDirs })}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localSettings.ignoreTestDirs ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button onClick={handleCancel} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
