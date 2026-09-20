import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileJson, GitBranch, FileText, CheckCircle } from 'lucide-react';
import { useVantage } from '../storage/store';
import { generateMockReport } from '../storage/mockData';

export default function ImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFilesScanned, setCryptoAssetsFound, addReport } = useVantage();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate parsing time
      setTimeout(() => {
        setFilesScanned(prev => prev + 124);
        setCryptoAssetsFound(prev => prev + 3);
        addReport(generateMockReport());
        setIsUploading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate('/app/inventory');
        }, 1500);
      }, 1500);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Data</h1>
        <p className="text-gray-400">Upload existing Software Bill of Materials (SBOM) or integrate with your source control to continuously scan for cryptographic assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manual Upload Section */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <UploadCloud className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold">Upload SBOM</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            We support standard formats including CycloneDX and SPDX. Upload your files to immediately visualize dependencies and risks.
          </p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".json,.xml" 
            className="hidden" 
          />

          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-[#444] rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-[#222] transition-colors"
          >
            {isUploading ? (
              <div className="animate-pulse flex flex-col items-center">
                <UploadCloud size={40} className="text-blue-500 mb-4 animate-bounce" />
                <p className="font-medium text-blue-400">Analyzing SBOM...</p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center">
                <CheckCircle size={40} className="text-green-500 mb-4" />
                <p className="font-medium text-green-500">Upload Successful!</p>
              </div>
            ) : (
              <>
                <FileJson size={40} className="text-gray-500 mb-4" />
                <p className="font-medium mb-1">Drag and drop your file here</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse from your computer</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                  Select File
                </button>
              </>
            )}
          </div>
        </div>

        {/* Integrations Section */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Continuous Integrations</h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 border border-[#333] rounded-lg bg-[#222]">
              <div className="flex items-center gap-3">
                <GitBranch size={24} />
                <div>
                  <h3 className="font-medium">GitHub Repository</h3>
                  <p className="text-xs text-gray-400">Scan code on every PR</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-sm font-medium transition-colors">
                Connect
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-green-900/30 rounded-lg bg-green-900/10">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-green-500" />
                <div>
                  <h3 className="font-medium text-green-500">GitLab CI/CD</h3>
                  <p className="text-xs text-green-400/70">Connected to 3 repositories</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                <CheckCircle size={16} />
                Active
              </div>
            </div>
            
             <div className="flex items-center justify-between p-4 border border-[#333] rounded-lg bg-[#222]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center font-bold text-xs">J</div>
                <div>
                  <h3 className="font-medium">Jira Software</h3>
                  <p className="text-xs text-gray-400">Auto-create migration tickets</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-sm font-medium transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
