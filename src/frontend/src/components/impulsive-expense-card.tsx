import React, { useState } from "react";

export function ImpulsiveSpendingCard() {
  const [itemName, setItemName] = useState("Energético");
  const [unitPrice, setUnitPrice] = useState(12.5);
  const [quantity, setQuantity] = useState(3);

  const totalSpent = unitPrice * quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(isNaN(val) ? 0 : val);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setUnitPrice(isNaN(val) ? 0 : val);
  };

  return (
    <div className="flex flex-col bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000] overflow-hidden cursor-default h-full">
      {/* Cabeçalho Azul com Título Maior (text-xl) */}
      <div className="bg-[#08233e] border-b-[3px] border-black px-5 py-4 flex justify-between items-center">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="bg-transparent text-white font-black tracking-widest uppercase text-xl outline-none w-full placeholder-gray-400"
          placeholder="NOME DO VÍCIO..."
        />

        {/* Tooltip Expandido */}
        <div className="relative group ml-4 flex-shrink-0">
          <button className="w-7 h-7 rounded bg-[#ffd100] text-black font-black text-sm border-2 border-black flex items-center justify-center cursor-help shadow-[2px_2px_0px_0px_#000000]">
            ?
          </button>
          <div className="absolute right-0 top-10 hidden group-hover:block w-72 p-4 bg-white border-[3px] border-black text-black text-xs font-bold rounded-xl shadow-[4px_4px_0px_0px_#000000] z-10 leading-relaxed">
            Use este card para rastrear vícios ou gastos pequenos, inúteis e
            recorrentes (ex: cartelas de cigarro, latas de energético, pod,
            chicletes). Edite a cotação e adicione sempre que consumir para ter
            uma noção real do impacto financeiro desse hábito.
          </div>
        </div>
      </div>

      {/* Corpo do Card: Mais compacto e alinhado (p-5 e gap-3) */}
      <div className="p-5 flex flex-col flex-1 gap-3 justify-center">
        {/* Linha da Cotação com Hover sutil */}
        <div className="flex justify-between items-center p-3 bg-white border-[3px] border-black rounded-xl hover:bg-gray-100 transition-colors">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Cotação Unitária
          </span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-black text-black">R$</span>
            <input
              type="number"
              value={unitPrice}
              onChange={handlePriceChange}
              // [appearance:textfield] e [&::-webkit...]:appearance-none escondem as setas nativas
              className="w-20 bg-transparent text-xl font-black text-black outline-none text-right focus:text-[#FF3B3B] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              step="0.01"
            />
          </div>
        </div>

        {/* Linha da Quantidade com Hover sutil */}
        <div className="flex justify-between items-center p-3 bg-white border-[3px] border-black rounded-xl hover:bg-gray-100 transition-colors">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Quantidade
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white border-[3px] border-black rounded-lg font-black text-2xl shadow-[2px_2px_0px_0px_#000000] hover:bg-gray-200 active:translate-y-[2px] active:shadow-none transition-all select-none"
            >
              -
            </button>

            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              // Escondendo as setas nativas aqui também
              className="w-16 text-center text-4xl font-black text-black bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center bg-[#FF3B3B] text-white border-[3px] border-black rounded-lg font-black text-2xl shadow-[2px_2px_0px_0px_#000000] hover:bg-[#e03535] active:translate-y-[2px] active:shadow-none transition-all select-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Gasto */}
        <div className="pt-3 flex justify-between items-end border-t-[3px] border-black border-dotted mt-2">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest pb-1.5">
            Impacto Total
          </span>
          <h2 className="text-4xl font-black text-[#FF3B3B] m-0 tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalSpent)}
          </h2>
        </div>
      </div>
    </div>
  );
}
