import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Background,
  BackgroundVariant,
  Controls,
  EdgeLabelRenderer,
  getBezierPath,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Wallet, Target, Check } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const COLORS = [
  { bg: "#ff6b9d", glow: "rgba(255,107,157,0.55)", name: "Rosa" },
  { bg: "#c44dff", glow: "rgba(196,77,255,0.55)", name: "Roxo" },
  { bg: "#4d79ff", glow: "rgba(77,121,255,0.55)", name: "Azul" },
  { bg: "#00d4aa", glow: "rgba(0,212,170,0.55)", name: "Turquesa" },
  { bg: "#00e676", glow: "rgba(0,230,118,0.55)", name: "Verde" },
  { bg: "#ff9f43", glow: "rgba(255,159,67,0.55)", name: "Laranja" },
  { bg: "#ff5252", glow: "rgba(255,82,82,0.55)", name: "Vermelho" },
  { bg: "#ffd100", glow: "rgba(255,209,0,0.55)", name: "Amarelo" },
];

const EMOJIS = ["💰","🎉","📈","👗","🍔","🍺","✈️","💊","📚","🏠","🐷","🎮","💄","🚗","📱","🎵","🏋️","☕"];

const SUGGESTIONS = [
  { name: "Diversão",     emoji: "🎉" },
  { name: "Investimentos",emoji: "📈" },
  { name: "Roupas",       emoji: "👗" },
  { name: "Alimentação",  emoji: "🍔" },
  { name: "Farra",        emoji: "🍺" },
  { name: "Viagem",       emoji: "✈️" },
  { name: "Saúde",        emoji: "💊" },
  { name: "Educação",     emoji: "📚" },
  { name: "Moradia",      emoji: "🏠" },
  { name: "Poupança",     emoji: "🐷" },
];

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  amount: number;
}

// ─── Custom Node: Income ─────────────────────────────────────────────────────

function IncomeNode({ data }: NodeProps) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState("");

  const income = data.income as number;
  const onIncomeChange = data.onIncomeChange as (v: number) => void;

  const startEdit = () => { setVal(String(income)); setEditing(true); };
  const commit = () => {
    const n = parseFloat(val.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
    onIncomeChange(n);
    setEditing(false);
  };

  return (
    <div style={{
      background: "#fff",
      border: "3px solid #000",
      boxShadow: "4px 4px 0px #ffd100",
      borderRadius: "12px",
      padding: "22px 28px",
      minWidth: "230px",
      userSelect: "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", justifyContent: "center" }}>
        <Wallet size={15} color="#000" />
        <span style={{ color: "#000", fontSize: "8px", fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "Manrope, sans-serif" }}>
          Receita do Mês
        </span>
      </div>

      {editing ? (
        <input
          autoFocus
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          className="nodrag"
          style={{
            background: "#fffaf0",
            border: "2px solid #000",
            borderRadius: "8px",
            color: "#000",
            fontSize: "28px",
            fontWeight: 900,
            width: "100%",
            textAlign: "center",
            outline: "none",
            padding: "4px 10px",
            boxSizing: "border-box",
            fontFamily: "Manrope, sans-serif",
          }}
        />
      ) : (
        <button
          onClick={startEdit}
          className="nodrag"
          style={{ background: "none", border: "none", cursor: "text", width: "100%", textAlign: "center", padding: 0 }}
        >
          <div style={{ color: "#08233e", fontSize: "32px", fontWeight: 900, lineHeight: 1, fontFamily: "Manrope, sans-serif" }}>
            {fmt(income)}
          </div>
          <div style={{ color: "rgba(0,0,0,0.35)", fontSize: "9px", marginTop: "7px", letterSpacing: "0.12em", fontFamily: "Manrope, sans-serif" }}>
            clique para editar
          </div>
        </button>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#ffd100", border: "2px solid #000", width: "14px", height: "14px", right: "-7px" }}
      />
    </div>
  );
}

// ─── Custom Node: Category ────────────────────────────────────────────────────

function CategoryNode({ id, data }: NodeProps) {
  const color  = data.color  as string;
  const name   = data.name   as string;
  const emoji  = data.emoji  as string;
  const amount = data.amount as number;
  const onDelete = data.onDelete as (id: string) => void;

  return (
    <div style={{
      background: "#fff",
      border: "3px solid #000",
      boxShadow: `4px 4px 0px ${color}`,
      borderRadius: "12px",
      padding: "14px 18px",
      minWidth: "175px",
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: color, border: "2px solid #000", width: "12px", height: "12px", left: "-6px" }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "22px" }}>{emoji}</span>
          <span style={{ color: "#000", fontSize: "9px", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Manrope, sans-serif" }}>
            {name}
          </span>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="nodrag"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "rgba(0,0,0,0.35)", lineHeight: 0 }}
        >
          <X size={12} />
        </button>
      </div>

      <div style={{
        color,
        fontSize: "26px",
        fontWeight: 900,
        textAlign: "center",
        fontFamily: "Manrope, sans-serif",
      }}>
        {fmt(amount)}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: color, border: "2px solid #000", width: "12px", height: "12px", right: "-6px" }}
      />
    </div>
  );
}

// ─── Custom Node: Balance ─────────────────────────────────────────────────────

function BalanceNode({ data }: NodeProps) {
  const totalIncome    = data.totalIncome    as number;
  const totalAllocated = data.totalAllocated as number;
  const balance  = totalIncome - totalAllocated;
  const pct      = totalIncome > 0 ? Math.min(100, (totalAllocated / totalIncome) * 100) : 0;
  const isPos    = balance >= 0;
  const color    = isPos ? "#00c853" : "#e53935";

  return (
    <div style={{
      background: "#fff",
      border: "3px solid #000",
      boxShadow: `4px 4px 0px ${color}`,
      borderRadius: "12px",
      padding: "22px 28px",
      minWidth: "230px",
      userSelect: "none",
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: color, border: "2px solid #000", width: "14px", height: "14px", left: "-7px" }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", justifyContent: "center" }}>
        <Target size={15} color="#000" />
        <span style={{ color: "#000", fontSize: "8px", fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "Manrope, sans-serif" }}>
          Saldo Fim do Mês
        </span>
      </div>

      <div style={{ color: "#08233e", fontSize: "32px", fontWeight: 900, textAlign: "center", lineHeight: 1, fontFamily: "Manrope, sans-serif" }}>
        {fmt(Math.abs(balance))}
      </div>
      <div style={{ color, fontSize: "9px", textAlign: "center", marginTop: "7px", letterSpacing: "0.12em", fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>
        {isPos ? "✓ disponível para gastar" : "⚠ você está no negativo"}
      </div>

      {totalIncome > 0 && (
        <div style={{ marginTop: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ color: "rgba(0,0,0,0.5)", fontSize: "9px", fontWeight: 700 }}>Alocado</span>
            <span style={{ color, fontSize: "9px", fontWeight: 700 }}>{pct.toFixed(0)}%</span>
          </div>
          <div style={{ height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.12)" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: color,
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Custom Edge: Animated Flow ───────────────────────────────────────────────

function AnimatedFlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const color = (data?.color as string) || "#ffd100";
  const amount = (data?.amount as number) ?? 0;
  const onEditAmount = data?.onEditAmount as ((edgeId: string) => void) | undefined;
  const pathId = `vizplan-path-${id}`;

  return (
    <>
      <defs>
        <path id={pathId} d={edgePath} fill="none" />
      </defs>

      {/* Main dashed path */}
      <path d={edgePath} stroke={color} strokeWidth={2} fill="none" opacity={0.75} strokeDasharray="7 5" />

      {/* Animated particles */}
      {([0, -0.55, -1.1] as number[]).map((begin, i) => (
        <circle key={i} r={i === 0 ? 5 : 3.5} fill={color} opacity={0.9}>
          <animateMotion dur={i === 0 ? "1.6s" : "1.9s"} repeatCount="indefinite" begin={`${begin}s`}>
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      ))}

      {/* Editable amount label */}
      {onEditAmount && <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onEditAmount?.(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "#fff",
              border: "2px solid #000",
              borderRadius: "8px",
              padding: "4px 11px",
              color: "#000",
              fontSize: "11px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "2px 2px 0px #000",
              fontFamily: "Manrope, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            <Pencil size={9} strokeWidth={2.5} color={color} />
            {fmt(amount)}
          </motion.button>
        </div>
      </EdgeLabelRenderer>}
    </>
  );
}

// ─── Node / Edge type maps ────────────────────────────────────────────────────

const nodeTypes = { income: IncomeNode, category: CategoryNode, balance: BalanceNode };
const edgeTypes = { flow: AnimatedFlowEdge };

// ─── Main Canvas ──────────────────────────────────────────────────────────────

function VisualPlanningCanvas() {
  const defaultCategories: CategoryItem[] = [
    { id: "cat-default-1", name: "Diversão",      emoji: "🎉", color: COLORS[0].bg, glow: COLORS[0].glow, amount: 0 },
    { id: "cat-default-2", name: "Investimentos", emoji: "📈", color: COLORS[4].bg, glow: COLORS[4].glow, amount: 0 },
    { id: "cat-default-3", name: "Poupança",      emoji: "🐷", color: COLORS[3].bg, glow: COLORS[3].glow, amount: 0 },
  ];

  const [income, setIncome]         = useState(5000);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Modal — add category
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName,      setNewName]      = useState("");
  const [newEmoji,     setNewEmoji]     = useState("💰");
  const [newColorIdx,  setNewColorIdx]  = useState(0);

  // Modal — edit edge amount
  const [editEdgeId, setEditEdgeId]   = useState<string | null>(null);
  const [editAmount,  setEditAmount]  = useState("");

  // Persist dragged positions across rebuilds
  const posRef = useRef<Record<string, { x: number; y: number }>>({});
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  // Stable callbacks
  const handleIncomeChange = useCallback((v: number) => setIncome(v), []);

  const handleDeleteCategory = useCallback((id: string) => {
    setCategories(cs => cs.filter(c => c.id !== id));
    delete posRef.current[id];
  }, []);

  const handleEditAmount = useCallback((edgeId: string) => {
    const catId = edgeId.replace("inc-", "");
    const cat = categoriesRef.current.find(c => c.id === catId);
    if (cat) {
      setEditAmount(String(cat.amount));
      setEditEdgeId(edgeId);
    }
  }, []);

  // Track positions when nodes are dragged
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    changes.forEach(c => {
      if (c.type === "position" && "position" in c && c.position) {
        posRef.current[c.id] = c.position as { x: number; y: number };
      }
    });
    onNodesChange(changes);
  }, [onNodesChange]);

  // Helper: compute default position, falling back to stored drag pos
  const getPos = (id: string, def: { x: number; y: number }) =>
    posRef.current[id] ?? def;

  // Rebuild graph whenever state changes
  useEffect(() => {
    const totalAllocated = categories.reduce((s, c) => s + c.amount, 0);
    const n = categories.length;
    const totalH = Math.max(0, n - 1) * 130;
    const centerY = 80 + totalH / 2;

    const newNodes: Node[] = [
      {
        id: "income",
        type: "income",
        position: getPos("income", { x: 60, y: centerY - 75 }),
        data: { income, onIncomeChange: handleIncomeChange },
      },
      ...categories.map((cat, i) => ({
        id: cat.id,
        type: "category",
        position: getPos(cat.id, { x: 390, y: 80 + i * 130 }),
        data: { ...cat, onDelete: handleDeleteCategory },
      })),
      {
        id: "balance",
        type: "balance",
        position: getPos("balance", { x: 720, y: centerY - 85 }),
        data: { totalIncome: income, totalAllocated },
      },
    ];

    const newEdges: Edge[] = categories.flatMap(cat => [
      {
        id: `inc-${cat.id}`,
        source: "income",
        target: cat.id,
        type: "flow",
        data: { color: cat.color, amount: cat.amount, onEditAmount: handleEditAmount },
      },
      {
        id: `${cat.id}-bal`,
        source: cat.id,
        target: "balance",
        type: "flow",
        data: { color: cat.color, amount: cat.amount },
      },
    ]);

    setNodes(newNodes);
    setEdges(newEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, income]);

  const totalAllocated = categories.reduce((s, c) => s + c.amount, 0);
  const balance = income - totalAllocated;

  const addCategory = () => {
    if (!newName.trim()) return;
    const c = COLORS[newColorIdx % COLORS.length];
    setCategories(cs => [...cs, {
      id: `cat-${Date.now()}`,
      name: newName.trim(),
      emoji: newEmoji,
      color: c.bg,
      glow: c.glow,
      amount: 0,
    }]);
    setShowAddModal(false);
    setNewName("");
    setNewEmoji("💰");
    setNewColorIdx(0);
  };

  const saveAmount = () => {
    if (!editEdgeId) return;
    const catId = editEdgeId.replace("inc-", "");
    const n = parseFloat(editAmount.replace(",", ".")) || 0;
    setCategories(cs => cs.map(c => c.id === catId ? { ...c, amount: n } : c));
    setEditEdgeId(null);
    setEditAmount("");
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        style={{ background: "transparent" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.3} color="rgba(0,0,0,0.1)" />
        <Controls style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "3px 3px 0px #000" }} />
      </ReactFlow>

      {/* ── Summary overlay ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          position: "absolute", top: 16, right: 16, zIndex: 10,
          background: "#fff",
          border: "2px solid #000",
          boxShadow: "4px 4px 0px #000",
          borderRadius: "12px",
          padding: "16px 20px",
          minWidth: "195px",
        }}
      >
        <div style={{ color: "#08233e", fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "12px", fontWeight: 900, fontFamily: "Manrope, sans-serif" }}>
          Resumo do Mês
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <Row label="Receita"  value={fmt(income)}          color="#08233e" />
          <Row label="Alocado"  value={fmt(totalAllocated)}  color="#ff9f43" />
          <div style={{ height: "1px", background: "rgba(0,0,0,0.1)", margin: "2px 0" }} />
          <Row label="Saldo"    value={fmt(balance)}         color={balance >= 0 ? "#00c853" : "#e53935"} big />
        </div>
        {income > 0 && (
          <div style={{ marginTop: "12px", height: "5px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.12)" }}>
            <div style={{
              height: "100%",
              width: `${Math.min(100, (totalAllocated / income) * 100)}%`,
              background: balance >= 0 ? "#00c853" : "#e53935",
              borderRadius: "1px",
              transition: "width 0.5s ease, background 0.5s ease",
            }} />
          </div>
        )}
      </motion.div>

      {/* ── Category count badge ─────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div style={{
          position: "absolute", top: 16, left: 16, zIndex: 10,
          background: "#fff",
          border: "2px solid #000",
          boxShadow: "3px 3px 0px #000",
          borderRadius: "8px",
          padding: "8px 14px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ fontSize: "14px" }}>📊</span>
          <span style={{ color: "#000", fontSize: "9px", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Manrope, sans-serif" }}>
            {categories.length} {categories.length === 1 ? "categoria" : "categorias"}
          </span>
        </div>
      )}

      {/* ── Add Category button ──────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowAddModal(true)}
        style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex", alignItems: "center", gap: "8px",
          background: "#ffd100",
          color: "#000",
          border: "2px solid #000",
          borderRadius: "999px",
          padding: "13px 30px",
          fontWeight: 900,
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "4px 4px 0px #000",
          fontFamily: "Manrope, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        <Plus size={15} strokeWidth={3} />
        Adicionar Categoria
      </motion.button>

      {/* ── Modal: Add Category ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setShowAddModal(false)}
            style={{
              position: "absolute", inset: 0, zIndex: 20,
              background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 18, opacity: 0 }}
              style={{
                background: "#fff",
                border: "3px solid #000",
                borderRadius: "16px",
                padding: "34px",
                width: "430px",
                maxWidth: "92vw",
                boxShadow: "6px 6px 0px #000",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px" }}>
                <h3 style={{ color: "#000", fontWeight: 900, fontSize: "19px", fontFamily: "Manrope, sans-serif", margin: 0 }}>
                  Nova Categoria
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ background: "none", border: "none", color: "rgba(0,0,0,0.4)", cursor: "pointer", lineHeight: 0 }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sugestões */}
              <div style={{ marginBottom: "22px" }}>
                <Label>Sugestões rápidas</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s.name}
                      onClick={() => { setNewName(s.name); setNewEmoji(s.emoji); }}
                      style={{
                        background: newName === s.name ? "#ffd100" : "#fff",
                        border: "2px solid #000",
                        borderRadius: "6px",
                        padding: "5px 11px",
                        color: "#000",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "5px",
                        fontFamily: "Manrope, sans-serif",
                        boxShadow: newName === s.name ? "2px 2px 0px #000" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {s.emoji} {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nome */}
              <div style={{ marginBottom: "18px" }}>
                <Label>Nome da categoria</Label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCategory()}
                  placeholder="ex: Diversão, Farra, Investimentos…"
                  autoFocus
                  style={{
                    width: "100%", marginTop: "8px",
                    background: "#fffaf0",
                    border: "2px solid #000",
                    borderRadius: "8px",
                    padding: "11px 16px",
                    color: "#000",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "Manrope, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Emoji */}
              <div style={{ marginBottom: "18px" }}>
                <Label>Ícone</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => setNewEmoji(e)}
                      style={{
                        background: newEmoji === e ? "#ffd100" : "#fff",
                        border: "2px solid #000",
                        borderRadius: "6px",
                        padding: "6px 9px",
                        fontSize: "17px",
                        cursor: "pointer",
                        boxShadow: newEmoji === e ? "2px 2px 0px #000" : "none",
                        transition: "all 0.13s ease",
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cor */}
              <div style={{ marginBottom: "28px" }}>
                <Label>Cor</Label>
                <div style={{ display: "flex", gap: "9px", flexWrap: "wrap", marginTop: "8px" }}>
                  {COLORS.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewColorIdx(idx)}
                      style={{
                        width: "30px", height: "30px",
                        borderRadius: "50%",
                        background: c.bg,
                        border: newColorIdx === idx ? "3px solid #000" : "2px solid rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        boxShadow: newColorIdx === idx ? "2px 2px 0px #000" : "none",
                        transition: "all 0.15s ease",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div style={{
                marginBottom: "22px",
                background: "#fffaf0",
                border: "2px solid #000",
                borderRadius: "8px",
                padding: "10px 14px",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{ fontSize: "20px" }}>{newEmoji}</span>
                <span style={{ color: newName ? "#000" : "rgba(0,0,0,0.3)", fontSize: "13px", fontWeight: 700, fontFamily: "Manrope" }}>
                  {newName || "Nome da categoria"}
                </span>
                <div style={{
                  marginLeft: "auto",
                  width: "12px", height: "12px",
                  borderRadius: "50%",
                  background: COLORS[newColorIdx].bg,
                  border: "2px solid #000",
                }} />
              </div>

              {/* Botões */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1, padding: "12px",
                    background: "#fff",
                    border: "2px solid #000",
                    borderRadius: "10px",
                    color: "#000",
                    fontWeight: 700, fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={newName.trim() ? { scale: 1.02 } : {}}
                  whileTap={newName.trim() ? { scale: 0.97 } : {}}
                  onClick={addCategory}
                  disabled={!newName.trim()}
                  style={{
                    flex: 2, padding: "12px",
                    background: newName.trim() ? "#ffd100" : "rgba(255,209,0,0.25)",
                    border: newName.trim() ? "2px solid #000" : "2px solid rgba(0,0,0,0.15)",
                    borderRadius: "10px",
                    color: newName.trim() ? "#000" : "rgba(0,0,0,0.3)",
                    fontWeight: 900, fontSize: "12px",
                    cursor: newName.trim() ? "pointer" : "not-allowed",
                    fontFamily: "Manrope, sans-serif",
                    boxShadow: newName.trim() ? "3px 3px 0px #000" : "none",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Plus size={14} strokeWidth={3} />
                  Criar Categoria
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal: Edit Amount ────────────────────────────────────────────── */}
      <AnimatePresence>
        {editEdgeId && (() => {
          const catId = editEdgeId.replace("inc-", "");
          const cat   = categories.find(c => c.id === catId);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={e => e.target === e.currentTarget && setEditEdgeId(null)}
              style={{
                position: "absolute", inset: 0, zIndex: 20,
                background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 12, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 12, opacity: 0 }}
                style={{
                  background: "#fff",
                  border: "3px solid #000",
                  borderRadius: "16px",
                  padding: "30px",
                  width: "320px",
                  maxWidth: "90vw",
                  boxShadow: `6px 6px 0px ${cat?.color ?? "#ffd100"}`,
                }}
              >
                <h3 style={{ color: "#000", fontWeight: 900, fontSize: "17px", margin: "0 0 6px", fontFamily: "Manrope" }}>
                  Definir Valor
                </h3>
                <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "12px", margin: "0 0 20px", fontFamily: "Manrope" }}>
                  {cat ? `Quanto vai para ${cat.emoji} ${cat.name}?` : "Quanto vai para esta categoria?"}
                </p>
                <div style={{ position: "relative", marginBottom: "22px" }}>
                  <span style={{
                    position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                    color: "#000", fontWeight: 900, fontSize: "17px", fontFamily: "Manrope",
                  }}>R$</span>
                  <input
                    autoFocus
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveAmount(); if (e.key === "Escape") setEditEdgeId(null); }}
                    placeholder="0,00"
                    style={{
                      width: "100%",
                      background: "#fffaf0",
                      border: "2px solid #000",
                      borderRadius: "10px",
                      padding: "13px 14px 13px 44px",
                      color: "#000",
                      fontSize: "24px",
                      fontWeight: 900,
                      outline: "none",
                      fontFamily: "Manrope, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setEditEdgeId(null)}
                    style={{
                      flex: 1, padding: "12px",
                      background: "#fff",
                      border: "2px solid #000",
                      borderRadius: "10px",
                      color: "#000",
                      fontWeight: 700, fontSize: "12px",
                      cursor: "pointer", fontFamily: "Manrope",
                    }}
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={saveAmount}
                    style={{
                      flex: 2, padding: "12px",
                      background: cat?.color ?? "#ffd100",
                      border: "2px solid #000",
                      borderRadius: "10px",
                      color: "#000",
                      fontWeight: 900, fontSize: "12px",
                      cursor: "pointer", fontFamily: "Manrope",
                      boxShadow: "3px 3px 0px #000",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                      letterSpacing: "0.12em", textTransform: "uppercase",
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                    Confirmar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "#08233e", fontSize: "8.5px", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Manrope" }}>
      {children}
    </span>
  );
}

function Row({ label, value, color, big }: { label: string; value: string; color: string; big?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "rgba(0,0,0,0.55)", fontSize: "10px", fontFamily: "Manrope", fontWeight: 600 }}>{label}</span>
      <span style={{ color, fontSize: big ? "15px" : "12px", fontWeight: 900, fontFamily: "Manrope" }}>{value}</span>
    </div>
  );
}

// ─── Exported Page ────────────────────────────────────────────────────────────

export function VisualPlanning() {
  return (
    <ReactFlowProvider>
      <VisualPlanningCanvas />
    </ReactFlowProvider>
  );
}
