/**
 * Wearables Connect - Connect fitness trackers and smartwatches
 * 
 * Features:
 * - Connect popular wearables (Apple Watch, Garmin, Fitbit, Whoop, etc)
 * - Sync status
 * - Last sync time
 * - Auto-sync toggle
 * - Disconnect option
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Phase 4
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Watch, RefreshCw, CheckCircle, AlertCircle, Link, Unlink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Wearable {
  id: string;
  name: string;
  brand: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  status?: 'syncing' | 'synced' | 'error';
}

export function WearablesConnect() {
  const [wearables, setWearables] = useState<Wearable[]>([
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      brand: 'Apple',
      icon: '⌚',
      connected: true,
      lastSync: 'Há 5 minutos',
      status: 'synced',
    },
    {
      id: 'garmin',
      name: 'Garmin Forerunner',
      brand: 'Garmin',
      icon: '🏃',
      connected: false,
    },
    {
      id: 'fitbit',
      name: 'Fitbit Charge',
      brand: 'Fitbit',
      icon: '📊',
      connected: false,
    },
    {
      id: 'whoop',
      name: 'WHOOP Strap',
      brand: 'WHOOP',
      icon: '💪',
      connected: false,
    },
    {
      id: 'polar',
      name: 'Polar Vantage',
      brand: 'Polar',
      icon: '❤️',
      connected: false,
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      brand: 'Oura',
      icon: '💍',
      connected: false,
    },
  ]);

  const [autoSync, setAutoSync] = useState(true);

  const handleConnect = async (id: string) => {
    setWearables((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: 'syncing' as const } : w
      )
    );

    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setWearables((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              connected: true,
              lastSync: 'Agora',
              status: 'synced' as const,
            }
          : w
      )
    );

    const device = wearables.find((w) => w.id === id);
    toast.success(`${device?.name} conectado com sucesso!`);
  };

  const handleDisconnect = (id: string) => {
    setWearables((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              connected: false,
              lastSync: undefined,
              status: undefined,
            }
          : w
      )
    );

    const device = wearables.find((w) => w.id === id);
    toast.success(`${device?.name} desconectado`);
  };

  const handleSync = async (id: string) => {
    setWearables((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: 'syncing' as const } : w
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setWearables((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              lastSync: 'Agora',
              status: 'synced' as const,
            }
          : w
      )
    );

    toast.success('Sincronizado com sucesso!');
  };

  const connectedCount = wearables.filter((w) => w.connected).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Watch className="h-6 w-6 text-violet-500" />
            Wearables & Dispositivos
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {connectedCount > 0
              ? `${connectedCount} ${connectedCount === 1 ? 'dispositivo conectado' : 'dispositivos conectados'}`
              : 'Conecta os teus dispositivos de fitness'}
          </p>
        </div>
      </div>

      {/* Auto-Sync Toggle */}
      <div className="mb-6 p-4 rounded-xl bg-violet-50 border border-violet-200">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-violet-900">Sincronização Automática</p>
              <p className="text-xs text-violet-700">
                Sincroniza dados a cada hora
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => {
              setAutoSync(e.target.checked);
              toast.success(
                e.target.checked
                  ? 'Sincronização automática ativada'
                  : 'Sincronização automática desativada'
              );
            }}
            className="h-5 w-5 rounded border-violet-300 text-violet-600 focus:ring-2 focus:ring-violet-500/30"
          />
        </label>
      </div>

      {/* Wearables List */}
      <div className="space-y-3">
        {wearables.map((wearable, idx) => (
          <motion.div
            key={wearable.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              wearable.connected
                ? 'border-violet-200 bg-violet-50/50'
                : 'border-slate-200 bg-white hover:border-violet-200'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left: Device Info */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-100 to-white border border-violet-200 flex items-center justify-center text-2xl">
                  {wearable.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{wearable.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-600">{wearable.brand}</span>
                    {wearable.connected && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{wearable.lastSync}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex items-center gap-3">
                {/* Status Badge */}
                {wearable.connected && (
                  <div className="flex items-center gap-1.5">
                    {wearable.status === 'syncing' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw className="h-4 w-4 text-violet-500" />
                      </motion.div>
                    )}
                    {wearable.status === 'synced' && (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                    {wearable.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {wearable.connected ? (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSync(wearable.id)}
                      disabled={wearable.status === 'syncing'}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sync
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDisconnect(wearable.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-all"
                    >
                      <Unlink className="h-4 w-4" />
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConnect(wearable.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Link className="h-3.5 w-3.5" />
                    Conectar
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 rounded-xl bg-sky-50 border border-sky-200">
        <p className="text-sm text-sky-900">
          <strong>💡 Dica:</strong> Conecta os teus dispositivos para sincronizar automaticamente dados
          de sono, frequência cardíaca, passos e calorias.
        </p>
      </div>
    </motion.div>
  );
}
