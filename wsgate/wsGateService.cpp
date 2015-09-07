#ifdef HAVE_CONFIG_H
# include "config.h"
#endif

#include <windows.h>
#include <iostream>
#include <string>
#include "wsGateService.hpp"
#include "btexception.hpp"
#include <boost/filesystem.hpp>
#ifdef _WIN32
#include <direct.h>
#endif

using namespace std;
using boost::filesystem::path;

extern bool g_signaled = false;
#ifdef _WIN32
extern bool g_service_background = true;
extern int _service_main (int argc, char **argv);
#endif

namespace wsgate{

    WsGateService::WsGateService()
        :NTService("FreeRDP-WebConnect", "FreeRDP WebConnect")
        {
            m_dwServiceStartupType = SERVICE_AUTO_START;
            m_sDescription.assign("RDP Web access gateway");
            AddDependency("Eventlog");
        }

    bool WsGateService::OnServiceStop(){
        g_signaled = true;
        return true;
    }

    bool WsGateService::OnServiceShutdown(){
        g_signaled = true;
        return true;
    }

    void WsGateService::RunService(){
        g_signaled = false;
        // On Windows, always set out working dir to ../ relatively seen from
        // the binary's path.
        path p(m_sModulePath);
        string wdir(p.branch_path().branch_path().string());
        chdir(wdir.c_str());
        g_signaled = false;
        char *argv[] = {
            strdup("wsgate"),
            strdup("-c"),
            strdup("etc/wsgate.ini"),
            NULL
        };
        int r = _service_main(3, argv);
        if (0 != r) {
            m_ServiceStatus.dwWin32ExitCode = ERROR_SERVICE_SPECIFIC_ERROR;
            m_ServiceStatus.dwServiceSpecificExitCode = r;
        }
        free(argv[0]);
        free(argv[1]);
        free(argv[2]);
    }

    bool WsGateService::ParseSpecialArgs(int argc, char **argv){
        if (argc < 2) {
            return false;
        }
        bool installed = false;
        try {
            installed = IsServiceInstalled();
        } catch (const tracing::runtime_error &e) {
            cerr << e.what() << endl;
            return true;
        }
        if (0 == strcmp(argv[1], "--query")) {
            // Report version of installed service
            cout << "The service is " << (installed ? "currently" : "not")
                << " installed." << endl;
            return true;
        }
        if (0 == strcmp(argv[1], "--start")) {
            // Start the service
            try {
                Start();
            } catch (const tracing::runtime_error &e) {
                cerr << "Failed to start " << m_sServiceName << endl;
                cerr << e.what() << endl;
            }
            return true;
        }
        if (0 == strcmp(argv[1], "--stop")) {
            // Start the service
            try {
                Stop();
            } catch (const tracing::runtime_error &e) {
                cerr << "Failed to stop " << m_sServiceName << endl;
                cerr << e.what() << endl;
            }
            return true;
        }
        if (0 == strcmp(argv[1], "--install")) {
            // Install the service
            if (installed) {
                cout << m_sServiceName << " is already installed." << endl;
            } else {
                try {
                    InstallService();
                    cout << m_sServiceName << " installed." << endl;
                } catch (const tracing::runtime_error &e) {
                    cerr << "Failed to install " << m_sServiceName << endl;
                    cerr << e.what() << endl;
                }
            }
            return true;
        }
        if (0 == strcmp(argv[1], "--remove")) {
            // Remove the service
            if (!installed) {
                cout << m_sServiceName << " is not installed." << endl;
            } else {
                try {
                    UninstallService();
                    cout << m_sServiceName << " removed." << endl;
                } catch (const tracing::runtime_error &e) {
                    cerr << "Failed to remove " << m_sServiceName << endl;
                    cerr << e.what() << endl;
                }
            }
            return true;
        }
        return false;
    }
}