'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/ui/sidebar';
import { Input } from '../../components/ui/input';   
import { Button } from '../../components/ui/button'; 
import { apiFetch } from '../../lib/api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Role {
  id: string;
  name: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);

  // Estados para el Modal de creación de usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        // Simulamos usuario (debes cambiar esto por una llamada a tu API /auth/me)
        setUser({ id: '6f6cc1e6...', email: 'example@smartbox.com', name: 'Admin', role: 'SUPER_ADMIN' });
        
        const rolesRes = await apiFetch('/roles'); // Endpoint que debe retornar [{id, name}, ...]
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setRoles(rolesData);
        }
      } catch (err) {
        console.error('Error al cargar datos', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserRole) {
      setFormError('Por favor, selecciona un rol válido.');
      return;
    }

    setIsCreating(true);
    setFormError('');
    setFormSuccess('');

   try {
      // 4. Enviamos directamente el nombre del rol al backend
      const res = await apiFetch('/auth/register-internal', { 
        method: 'POST',
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          roleName: newUserRole,
        }),
      });

      if (res.ok) {
        setFormSuccess('Usuario creado con éxito.');
        setNewUserName(''); setNewUserEmail(''); setNewUserPassword(''); setNewUserRole('');
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        const data = await res.json();
        setFormError(data.message || 'Error al crear el usuario.');
      }
    } catch (err) {
      setFormError('No se pudo conectar con el servidor.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('');
    setFormError('');
    setFormSuccess('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide">Cargando SmartBox System...</p>
        </div>
      </div>
    );
  }

  const systemStats = [
    { title: 'Pods SmartBox (IoT)', value: '12 / 15', sub: '3 en mantenimiento (active/offline)', color: 'border-l-teal-500', icon: '📦' },
    { title: 'Reservas Activas (Hoy)', value: '42', sub: 'Estatus: pending / active', color: 'border-l-indigo-500', icon: '📅' },
    { title: 'Ingresos de Caja (Stripe)', value: '$1,240.50', sub: 'Validados vía Webhooks', color: 'border-l-emerald-500', icon: '💳' },
    { title: 'Estado Broker EMQX', value: 'Estable', sub: 'Heartbeats ESP32 estables', color: 'border-l-amber-500', icon: '⚡' },
  ];

  const recentReservations = [
    { id: 'RES-2026-001', user: 'Carlos Mendoza', pod: 'Pod-003', status: 'active', time: '10:00 - 12:00' },
    { id: 'RES-2026-002', user: 'Ana María Silva', pod: 'Pod-001', status: 'paid', time: '13:00 - 14:30' },
    { id: 'RES-2026-003', user: 'Kevin Ortega', pod: 'Pod-012', status: 'pending', time: '15:00 - 16:00' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <div className="p-8 px-10 max-w-[1500px] mx-auto space-y-8">
          
          {/* Encabezado con disparador de Modal */}
          <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Panel de Control General</h1>
              <p className="text-sm text-slate-500 mt-1">
                Bienvenido de vuelta, <span className="font-semibold text-slate-700">{user?.name}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* ➕ Botón para abrir el Modal (Solo visible/útil para administradores) */}
              {user?.role === 'SUPER_ADMIN' && (
                <button
                 onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>👤+</span> Crear Usuario
                </button>
              )}

              <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </header>

          {/* Grid de Tarjetas */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {systemStats.map((stat, idx) => (
              <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${stat.color} flex justify-between items-center transition-transform hover:-translate-y-1 duration-200`}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                  <span className="text-xs text-slate-500 mt-1 block">{stat.sub}</span>
                </div>
                <span className="text-2xl p-3 bg-slate-50 rounded-xl">{stat.icon}</span>
              </div>
            ))}
          </section>

          {/* Módulo de Reservas */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Monitoreo de Reservas (Módulo Base)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Sincronizado con Base de Datos PostgreSQL</p>
              </div>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Ver Gestión de Reservas →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-xs tracking-wider">
                    <th className="py-3 font-semibold">ID Reserva</th>
                    <th className="py-3 font-semibold">Usuario</th>
                    <th className="py-3 font-semibold">Cápsula Asignada</th>
                    <th className="py-3 font-semibold">Bloque Horario</th>
                    <th className="py-3 font-semibold text-right">Estado de Flujo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {recentReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 font-mono font-medium text-slate-900 text-xs">{res.id}</td>
                      <td className="py-4 font-medium">{res.user}</td>
                      <td className="py-4 text-slate-600 font-medium">{res.pod}</td>
                      <td className="py-4 text-slate-500">{res.time}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                          res.status === 'active' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                          res.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {res.status === 'active' ? 'En Uso' : res.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* MODAL OVERLAY: Creación de Usuarios por SuperAdmin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5 relative">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-950">Registrar Nuevo Operador</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-medium"
              >
                ✕
              </button>
            </div>

            {formError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">{formError}</div>}
            {formSuccess && <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-medium">{formSuccess}</div>}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <Input
                label="Nombre Completo"
                type="text"
                required
                placeholder="Ej. Nombre del Staff"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />

              <Input
                label="Correo Electrónico"
                type="email"
                required
                placeholder="staff@smartbox.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />

              <Input
                label="Contraseña Temporal"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Asignación de Rol
                </label>
                <select 
                  value={newUserRole} 
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-sm appearance-none"
                >
                  <option value="" className="text-slate-500 bg-white" disabled>
                    Selecciona un rol...
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={isCreating}>
                  {isCreating ? 'Guardando...' : 'Confirmar Registro'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}