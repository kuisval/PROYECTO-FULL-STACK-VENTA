import styled, { keyframes } from 'styled-components';
import { useAuthStore } from "../../store/AuthStore";
import { UserAuth } from "../../context/AuthContent";
import { v } from "../../styles/variables";
import { supabase } from "../../supabase/supabase.config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const ACCESOS = [
  { label: 'Vender', icon: 'lucide:shopping-cart', to: '/pos',       color: '#1cb0f6', bg: 'rgba(28,176,246,0.12)' },
  { label: 'Kardex', icon: 'lucide:package',       to: '/kardex',    color: '#9046FF', bg: 'rgba(144,70,255,0.12)' },
  { label: 'Reportes',icon:'lucide:bar-chart-3',   to: '/reportes',  color: '#53B257', bg: 'rgba(83,178,87,0.12)'  },
  { label: 'Config',  icon: 'lucide:settings',     to: '/configurar',color: '#f0a500', bg: 'rgba(240,165,0,0.12)'  },
];

export function HomeTemplate() {
  const { cerrarSesion } = useAuthStore();
  const { user } = UserAuth();
  const navigate = useNavigate();

  const [stats, setStats]         = useState({ ventas: 0, productos: 0, stockBajo: 0, ingresos: 0 });
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const [
        { count: totalVentas },
        { count: totalProductos },
        { data: ventasHoy },
        { data: stockBajoData },
        { data: ultimasVentas },
      ] = await Promise.all([
        supabase.from('ventas').select('*', { count: 'exact', head: true }),
        supabase.from('productos').select('*', { count: 'exact', head: true }),
        supabase.from('ventas').select('total').gte('created_at', hoy.toISOString()),
        supabase.from('productos').select('id').filter('stock', 'lte', 'stock_minimo'),
        supabase.from('ventas').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const ingresos = (ventasHoy || []).reduce((s, v) => s + (v.total || 0), 0);

      setStats({
        ventas:    totalVentas   || 0,
        productos: totalProductos || 0,
        stockBajo: (stockBajoData || []).length,
        ingresos,
      });
      setRecientes(ultimasVentas || []);
      setLoading(false);
    };
    fetch().catch(() => setLoading(false));
  }, []);

  const handleCerrar = async () => { await cerrarSesion(); navigate('/login'); };

  const nombre = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
  const hora   = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  const STATS = [
    { label: 'Ventas totales',   valor: stats.ventas,              color: '#1cb0f6', icon: 'lucide:trending-up'    },
    { label: 'Ingresos de hoy',  valor: `$${stats.ingresos.toFixed(2)}`, color: '#53B257', icon: 'lucide:banknote' },
    { label: 'Productos',        valor: stats.productos,            color: '#9046FF', icon: 'lucide:package'       },
    { label: 'Stock bajo',       valor: stats.stockBajo,            color: '#F54E41', icon: 'lucide:alert-triangle' },
  ];

  return (
    <Container>

      {/* ── HERO ── */}
      <Hero>
        <div className="hero-text">
          <span className="saludo">{saludo},</span>
          <h1>{nombre} 👋</h1>
          <p>{new Date().toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <button className="logout" onClick={handleCerrar}>
          <v.iconoCerrarSesion /> Salir
        </button>
        <div className="orb orb1" />
        <div className="orb orb2" />
      </Hero>

      {/* ── STATS ── */}
      <StatsGrid>
        {STATS.map(({ label, valor, color, icon }, i) => (
          <StatCard key={label} $color={color} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="icon-wrap" style={{ background: color + '20', color }}>
              <Icon icon={icon} />
            </div>
            <div>
              <p className="label">{label}</p>
              <h2 className="valor">{loading ? '—' : valor}</h2>
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      <BottomGrid>

        {/* ── ACCESO RÁPIDO ── */}
        <section>
          <SectionTitle>Acceso rápido</SectionTitle>
          <AccesosGrid>
            {ACCESOS.map(({ label, icon, to, color, bg }) => (
              <AccesoCard key={label} onClick={() => navigate(to)} $color={color} $bg={bg}>
                <div className="icono">
                  <Icon icon={icon} />
                </div>
                <span>{label}</span>
                <Icon icon="lucide:arrow-right" className="arrow" />
              </AccesoCard>
            ))}
          </AccesosGrid>
        </section>

        {/* ── ÚLTIMAS VENTAS ── */}
        <section>
          <SectionTitle>Últimas ventas</SectionTitle>
          <VentasCard>
            {loading ? (
              <p className="empty">Cargando...</p>
            ) : recientes.length === 0 ? (
              <EmptyState>
                <Icon icon="lucide:receipt" />
                <p>Sin ventas aún</p>
                <button onClick={() => navigate('/pos')}>Ir al POS →</button>
              </EmptyState>
            ) : (
              recientes.map((v, i) => (
                <VentaRow key={v.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="dot" />
                  <div className="info">
                    <span className="fecha">
                      {new Date(v.created_at).toLocaleString('es-MX', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                  <span className="monto">${(v.total || 0).toFixed(2)}</span>
                </VentaRow>
              ))
            )}
            {recientes.length > 0 && (
              <button className="ver-mas" onClick={() => navigate('/reportes')}>
                Ver todos los reportes →
              </button>
            )}
          </VentasCard>
        </section>

      </BottomGrid>
    </Container>
  );
}

/* ── ANIMATIONS ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: .5; }
  50%       { transform: scale(1.15); opacity: .3; }
`;

/* ── STYLED COMPONENTS ── */
const Container = styled.div`
  padding: 28px;
  min-height: 100vh;
  padding-bottom: 90px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Hero = styled.div`
  position: relative;
  background: linear-gradient(135deg, #1cb0f6 0%, #0a7abf 100%);
  border-radius: 24px;
  padding: 32px 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  animation: ${fadeUp} 0.5s ease both;

  .hero-text {
    position: relative;
    z-index: 1;
    .saludo { font-size: 15px; font-weight: 600; color: rgba(255,255,255,.8); display: block; margin-bottom: 4px; }
    h1 { margin: 0 0 6px; font-size: 28px; font-weight: 900; color: #fff; }
    p  { margin: 0; font-size: 13px; color: rgba(255,255,255,.7); text-transform: capitalize; }
  }

  .logout {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,.2);
    border: 1.5px solid rgba(255,255,255,.35);
    color: #fff;
    padding: 9px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 13px;
    backdrop-filter: blur(6px);
    transition: background .2s;
    flex-shrink: 0;
    &:hover { background: rgba(255,255,255,.32); }
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    animation: ${pulse} 4s ease-in-out infinite;
  }
  .orb1 {
    width: 180px; height: 180px;
    background: rgba(255,255,255,.12);
    bottom: -60px; right: 80px;
  }
  .orb2 {
    width: 100px; height: 100px;
    background: rgba(255,255,255,.08);
    top: -30px; right: 20px;
    animation-delay: 1.5s;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 14px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border: 2px solid ${({ theme }) => theme.color2};
  border-radius: 18px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: ${fadeUp} 0.5s ease both;
  transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.09); }

  .icon-wrap {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .label {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colorSubtitle};
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .valor {
    margin: 0;
    font-size: 26px;
    font-weight: 900;
    color: ${({ $color }) => $color};
  }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: ${({ theme }) => theme.colorSubtitle};
`;

const AccesosGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AccesoCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border: 2px solid ${({ theme }) => theme.color2};
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all .2s;
  animation: ${fadeUp} 0.5s ease both;

  &:hover {
    border-color: ${({ $color }) => $color};
    background: ${({ $bg }) => $bg};
    transform: translateX(4px);
    .arrow { opacity: 1; transform: translateX(4px); }
  }

  .icono {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: ${({ $bg }) => $bg};
    color: ${({ $color }) => $color};
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  span {
    flex: 1;
    font-weight: 700;
    font-size: 15px;
  }

  .arrow {
    font-size: 18px;
    color: ${({ $color }) => $color};
    opacity: 0;
    transition: all .2s;
  }
`;

const VentasCard = styled.div`
  background: ${({ theme }) => theme.bg};
  border: 2px solid ${({ theme }) => theme.color2};
  border-radius: 18px;
  padding: 6px 0;
  overflow: hidden;

  .empty { padding: 20px; color: ${({ theme }) => theme.colorSubtitle}; text-align: center; }

  .ver-mas {
    display: block;
    width: 100%;
    padding: 14px;
    background: none;
    border: none;
    border-top: 2px solid ${({ theme }) => theme.color2};
    color: #1cb0f6;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: background .15s;
    &:hover { background: ${({ theme }) => theme.bgAlpha}; }
  }
`;

const VentaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.color2};
  animation: ${fadeUp} 0.4s ease both;
  transition: background .15s;
  &:hover { background: ${({ theme }) => theme.bgAlpha}; }
  &:last-of-type { border-bottom: none; }

  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #1cb0f6;
    flex-shrink: 0;
  }
  .info { flex: 1; }
  .fecha { font-size: 13px; font-weight: 600; color: ${({ theme }) => theme.colorSubtitle}; text-transform: capitalize; }
  .monto { font-weight: 900; font-size: 15px; color: #53B257; }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  gap: 10px;
  color: ${({ theme }) => theme.colorSubtitle};
  font-size: 36px;
  p { margin: 0; font-size: 14px; font-weight: 600; }
  button {
    background: none;
    border: 2px solid #1cb0f6;
    color: #1cb0f6;
    padding: 8px 18px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    font-size: 13px;
    &:hover { background: #1cb0f6; color: #fff; }
  }
`;
