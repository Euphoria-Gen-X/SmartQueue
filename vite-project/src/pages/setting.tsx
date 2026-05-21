import { Bell, Moon, User, Shield } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your account preferences and notifications
        </p>
      </div>
      {/* Settings Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-violet-700 text-white flex items-center justify-center">
              <User size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Rashmipriya Sahoo
              </h2>
              <p className="text-gray-500">
                srashmipriya98@gmail.com
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">
                Phone Number
              </p>
              <h3 className="font-semibold text-gray-800">
                +91 7596982252
              </h3>
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                Account Type
              </p>
              <h3 className="font-semibold text-gray-800">
                Premium User
              </h3>
            </div>
          </div>
        </div>
        {/* Preferences Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Preferences
          </h2>
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-violet-700" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive appointment updates
                  </p>
                </div>
              </div>
              <button className="w-14 h-7 bg-violet-700 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1"></div>
              </button>
            </div>
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="text-violet-700" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-500">
                    Switch app appearance
                  </p>
                </div>
              </div>
              <button className="w-14 h-7 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1"></div>
              </button>
            </div>
            {/* Privacy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="text-violet-700" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Privacy
                  </h3>
                  <p className="text-sm text-gray-500">
                    Manage account security
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-violet-100 text-violet-700 rounded-xl hover:bg-violet-200 transition-all">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;