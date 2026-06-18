import { useState, useEffect } from "react";

// ─── CORES ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#FAF7F2",
  card: "#FFFFFF",
  cardAlt: "#F5F0E8",
  primary: "#1A1A1A",
  accent: "#B07D4A",
  accentLight: "#F5EAD8",
  green: "#27AE60",
  greenLight: "#E8F8EF",
  red: "#E74C3C",
  redLight: "#FDECEA",
  text: "#1A1A1A",
  textMuted: "#8B7355",
  border: "#E8DDD0",
  tabBg: "#FFFFFF",
  rest: "#E8F4FD",
  restText: "#2980B9",
};

// ─── BIBLIOTECA DE EXERCÍCIOS ────────────────────────────────────────────────
const EXERCISES = {
  1: {
    id: 1,
    name: "Agachamento na Parede",
    muscle: "Pernas e Glúteos",
    calories: 55,
    duration: "45 seg",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=480&q=80&auto=format&fit=crop",
    instructions: "Encoste as costas na parede com os pés afastados na largura dos ombros. Desça lentamente dobrando os joelhos até 90°, como se fosse sentar numa cadeira. Mantenha as costas retas na parede e os joelhos alinhados com os pés. Segure a posição por 30-45 segundos.",
    tips: "Mantenha o core contraído e respire de forma controlada.",
  },
  2: {
    id: 2,
    name: "Ponte de Ombros",
    muscle: "Glúteos e Posteriores",
    calories: 50,
    duration: "40 seg",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=480&q=80&auto=format&fit=crop",
    instructions: "Deite de costas com os joelhos dobrados e os pés apoiados na parede. Eleve o quadril formando uma linha reta dos ombros aos joelhos. Contraia os glúteos no topo e desça lentamente.",
    tips: "Pressione os pés na parede para ativar os glúteos ao máximo.",
  },
  3: {
    id: 3,
    name: "Elevação de Pernas",
    muscle: "Core e Abdômen",
    calories: 45,
    duration: "30 seg",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&q=80&auto=format&fit=crop",
    instructions: "Deite de costas próxima à parede, com as pernas estendidas apoiadas na parede. Afaste as pernas lentamente da parede mantendo-as retas, depois retorne. Controle o movimento e mantenha a lombar na colchonete.",
    tips: "Nunca perca o contato da lombar com o chão.",
  },
  4: {
    id: 4,
    name: "Flexão na Parede",
    muscle: "Peito, Ombros e Tríceps",
    calories: 50,
    duration: "40 seg",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=480&q=80&auto=format&fit=crop",
    instructions: "Fique de pé a cerca de 60 cm da parede. Apoie as palmas das mãos na parede na altura dos ombros. Flexione os cotovelos aproximando o peito da parede, mantendo o corpo reto. Empurre de volta à posição inicial.",
    tips: "Quanto mais longe da parede, mais difícil o exercício.",
  },
  5: {
    id: 5,
    name: "Prancha com Apoio",
    muscle: "Core, Abdômen e Costas",
    calories: 60,
    duration: "30 seg",
    sets: "3 séries",
    level: "Intermediário",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=480&q=80&auto=format&fit=crop",
    instructions: "Apoie os antebraços no chão e os pés na parede, mantendo o corpo reto como uma prancha. Contraia o abdômen, glúteos e coxas. Respire de forma controlada e mantenha a posição.",
    tips: "Não deixe o quadril subir nem cair — mantenha uma linha reta.",
  },
  6: {
    id: 6,
    name: "Círculo de Pernas",
    muscle: "Quadris e Coxas",
    calories: 40,
    duration: "30 seg cada lado",
    sets: "2 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=480&q=80&auto=format&fit=crop",
    instructions: "Deite de costas com as pernas na parede. Afaste uma perna fazendo um círculo controlado no ar, depois troque de lado. Mantenha a lombar colada no chão durante todo o movimento.",
    tips: "Faça círculos pequenos no início e aumente conforme ganha confiança.",
  },
  7: {
    id: 7,
    name: "Extensão de Quadril",
    muscle: "Glúteos e Posteriores",
    calories: 45,
    duration: "12 repetições",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=480&q=80&auto=format&fit=crop",
    instructions: "Em pé de frente para a parede, apoie as mãos nela. Empurre uma perna para trás e para cima, contraindo o glúteo no topo. Mantenha o tronco ereto e controle a descida. Alterne as pernas.",
    tips: "Não curve a coluna — o movimento vem apenas do quadril.",
  },
  8: {
    id: 8,
    name: "Pliê na Parede",
    muscle: "Coxas Internas e Glúteos",
    calories: 55,
    duration: "45 seg",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=480&q=80&auto=format&fit=crop",
    instructions: "Fique de pé com as costas na parede, pés afastados e dedos apontados para fora (tipo 'V'). Desça o quadril dobrando os joelhos na direção dos dedos dos pés. Suba lentamente contraindo as coxas internas e glúteos.",
    tips: "Mantenha os joelhos alinhados com os dedos dos pés ao longo de todo o movimento.",
  },
  9: {
    id: 9,
    name: "Roll Down na Parede",
    muscle: "Coluna e Core",
    calories: 35,
    duration: "8 repetições",
    sets: "2 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=480&q=80&auto=format&fit=crop",
    instructions: "Em pé com as costas na parede. Enrole a coluna vértebra por vértebra para frente e para baixo, deixando os braços pendentes. Desça até onde for confortável. Suba lentamente, reconstituindo cada vértebra na parede.",
    tips: "Esse exercício é excelente para mobilizar e aliviar a coluna.",
  },
  10: {
    id: 10,
    name: "Tesoura de Pernas",
    muscle: "Core e Coxas",
    calories: 45,
    duration: "30 seg",
    sets: "3 séries",
    level: "Intermediário",
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=480&q=80&auto=format&fit=crop",
    instructions: "Deite de costas com as pernas na parede. Abra as pernas lateralmente o mais que conseguir de forma confortável, depois feche lentamente. Mantenha a lombar colada no chão durante todo o exercício.",
    tips: "Vá somente até onde sentir um alongamento suave, sem forçar.",
  },
  11: {
    id: 11,
    name: "Abdução de Quadril",
    muscle: "Coxas Externas e Glúteos",
    calories: 40,
    duration: "15 repetições",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1578762560042-46ad127c95ea?w=480&q=80&auto=format&fit=crop",
    instructions: "De lado com o cotovelo apoiado na colchonete e os pés na parede. Eleve a perna de cima afastando-a o máximo que conseguir, depois desça controlado. Mantenha o quadril estável durante o movimento. Troque de lado.",
    tips: "Não deixe o quadril girar — o movimento é lateral.",
  },
  12: {
    id: 12,
    name: "Elevação de Calcanhar",
    muscle: "Panturrilhas e Equilíbrio",
    calories: 30,
    duration: "20 repetições",
    sets: "3 séries",
    level: "Iniciante",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=480&q=80&auto=format&fit=crop",
    instructions: "Em pé de frente para a parede, apoie levemente as pontas dos dedos para equilíbrio. Eleve os calcanhares do chão, ficando na ponta dos pés. Segure 2 segundos e desça controlado. Mantenha a postura ereta.",
    tips: "Faça o movimento lento para sentir a contração nas panturrilhas.",
  },
};

// ─── PLANO DE REFEIÇÕES (7 opções por tipo, rotação semanal) ─────────────────
const BREAKFASTS = [
  { name: "Omelete de Espinafre com Torrada Integral", cals: 285, prot: 22, carbs: 26, fat: 10, image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80&auto=format&fit=crop", ingredients: "2 ovos inteiros, 1 punhado de espinafre, 1 col. queijo cottage, 2 fatias de pão integral, sal e azeite a gosto" },
  { name: "Iogurte Natural com Granola e Frutas", cals: 260, prot: 14, carbs: 38, fat: 6, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&auto=format&fit=crop", ingredients: "200g iogurte natural integral, 3 col. granola, 1/2 banana, morangos a gosto, 1 fio de mel" },
  { name: "Vitamina de Banana com Aveia", cals: 270, prot: 12, carbs: 44, fat: 5, image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80&auto=format&fit=crop", ingredients: "1 banana, 4 col. aveia em flocos, 200ml leite (vaca ou vegetal), 1 col. chia, canela" },
  { name: "Ovos Mexidos com Tomate e Queijo Cottage", cals: 250, prot: 24, carbs: 10, fat: 13, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&auto=format&fit=crop", ingredients: "3 ovos, 1 tomate médio, 3 col. queijo cottage, sal, pimenta, cebolinha, azeite" },
  { name: "Panqueca de Aveia com Mel e Frutas", cals: 295, prot: 12, carbs: 46, fat: 7, image: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=400&q=80&auto=format&fit=crop", ingredients: "4 col. aveia, 2 ovos, 1 banana amassada, 1 col. mel, frutas vermelhas a gosto" },
  { name: "Tapioca com Queijo e Tomate", cals: 240, prot: 15, carbs: 32, fat: 6, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80&auto=format&fit=crop", ingredients: "2 col. sopa de goma de tapioca, 2 fatias de queijo branco, 4 fatias de tomate, orégano" },
  { name: "Mingau de Aveia com Frutas Vermelhas", cals: 255, prot: 10, carbs: 42, fat: 6, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&auto=format&fit=crop", ingredients: "5 col. aveia em flocos, 250ml leite desnatado, 1 col. mel, mix de frutas vermelhas, canela" },
];

const SNACKS = [
  { name: "Banana com Pasta de Amendoim", cals: 185, prot: 5, carbs: 28, fat: 7, image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80&auto=format&fit=crop", ingredients: "1 banana média, 1 col. sopa de pasta de amendoim integral (sem açúcar)" },
  { name: "Castanhas e Frutas Secas", cals: 175, prot: 4, carbs: 18, fat: 11, image: "https://images.unsplash.com/photo-1536591375667-7e7b979c2a31?w=400&q=80&auto=format&fit=crop", ingredients: "10 castanhas-do-pará, 5 nozes, 1 col. uva-passa, 2 tâmaras" },
  { name: "Iogurte Grego com Mel e Canela", cals: 160, prot: 12, carbs: 18, fat: 4, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80&auto=format&fit=crop", ingredients: "170g iogurte grego natural, 1 col. chá de mel, 1 pitada de canela em pó" },
  { name: "Maçã com Queijo Cottage", cals: 155, prot: 9, carbs: 22, fat: 3, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80&auto=format&fit=crop", ingredients: "1 maçã média, 100g queijo cottage, canela a gosto" },
  { name: "Smoothie Verde Energizante", cals: 150, prot: 4, carbs: 28, fat: 3, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80&auto=format&fit=crop", ingredients: "1 punhado espinafre, 1 maçã verde, 1 pedaço gengibre, suco de 1 limão, 200ml água gelada" },
  { name: "Abacate com Limão e Sal Marinho", cals: 165, prot: 2, carbs: 10, fat: 14, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80&auto=format&fit=crop", ingredients: "1/2 abacate médio, suco de 1 limão, sal marinho, pimenta opcional" },
  { name: "Ovo Cozido com Pepino e Cenoura", cals: 140, prot: 8, carbs: 10, fat: 7, image: "https://images.unsplash.com/photo-1512621776951-a57ef161b3c4?w=400&q=80&auto=format&fit=crop", ingredients: "1 ovo cozido, 1/2 pepino, 1 cenoura baby, sal e azeite a gosto" },
];

const LUNCHES = [
  { name: "Frango Grelhado com Arroz Integral e Salada", cals: 455, prot: 40, carbs: 46, fat: 9, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop", ingredients: "150g peito de frango grelhado, 4 col. sopa de arroz integral, alface, tomate, pepino, azeite e limão" },
  { name: "Peixe Assado com Batata-Doce e Brócolis", cals: 420, prot: 38, carbs: 36, fat: 10, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop", ingredients: "150g filé de tilápia ou merluza assado, 1 batata-doce média, 1 xíc. brócolis no vapor, ervas" },
  { name: "Atum com Quinoa e Salada Verde", cals: 390, prot: 35, carbs: 32, fat: 12, image: "https://images.unsplash.com/photo-1512621776951-a57ef161b3c4?w=400&q=80&auto=format&fit=crop", ingredients: "1 lata de atum em água (escorrido), 4 col. quinoa cozida, rúcula, azeitona, azeite e limão" },
  { name: "Frango com Mandioca Cozida e Couve Refogada", cals: 445, prot: 38, carbs: 42, fat: 8, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop", ingredients: "150g frango cozido, 150g mandioca cozida, 2 folhas de couve refogada com alho, azeite" },
  { name: "Ovos ao Forno com Arroz, Feijão e Legumes", cals: 460, prot: 28, carbs: 54, fat: 12, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80&auto=format&fit=crop", ingredients: "2 ovos, 3 col. arroz integral, 3 col. feijão carioca, cenoura, abobrinha, azeite" },
  { name: "Frango Ensopado com Macarrão Integral e Tomate", cals: 440, prot: 36, carbs: 48, fat: 9, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80&auto=format&fit=crop", ingredients: "150g frango em pedaços, 80g macarrão integral cozido, tomate, alho, cebola, azeite, ervas" },
  { name: "Tilápia Grelhada com Arroz e Salada de Beterraba", cals: 410, prot: 36, carbs: 40, fat: 10, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop", ingredients: "150g tilápia grelhada com limão, 3 col. arroz branco ou integral, 1/2 beterraba cozida, rúcula" },
];

const DINNERS = [
  { name: "Salmão Grelhado com Espinafre e Limão", cals: 380, prot: 36, carbs: 12, fat: 20, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop", ingredients: "150g filé de salmão, 2 punhados de espinafre refogado, suco de 1 limão, alho, azeite" },
  { name: "Frango no Vapor com Legumes Coloridos", cals: 320, prot: 34, carbs: 22, fat: 8, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop", ingredients: "150g frango cozido no vapor, abobrinha, cenoura, brócolis, ervilha, azeite e ervas" },
  { name: "Omelete de Legumes com Salada", cals: 295, prot: 22, carbs: 14, fat: 17, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&auto=format&fit=crop", ingredients: "3 ovos, pimentão, tomate, cebolinha, espinafre, 1 fio de azeite, salada verde" },
  { name: "Sopa de Legumes com Frango Desfiado", cals: 310, prot: 30, carbs: 28, fat: 7, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80&auto=format&fit=crop", ingredients: "100g frango desfiado, cenoura, batata-doce, chuchu, caldo de galinha caseiro, ervas" },
  { name: "Peixe Assado com Batata-Doce e Limão", cals: 360, prot: 32, carbs: 30, fat: 12, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop", ingredients: "150g peixe branco assado, 1 batata-doce pequena, limão, alecrim, azeite, alho" },
  { name: "Salada de Quinoa com Grão-de-Bico", cals: 340, prot: 18, carbs: 44, fat: 10, image: "https://images.unsplash.com/photo-1512621776951-a57ef161b3c4?w=400&q=80&auto=format&fit=crop", ingredients: "4 col. quinoa cozida, 3 col. grão-de-bico, tomate cereja, pepino, rúcula, azeite, limão" },
  { name: "Frango com Chuchu Refogado e Arroz Integral", cals: 350, prot: 34, carbs: 32, fat: 9, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop", ingredients: "150g frango grelhado, 1 chuchu refogado com alho, 3 col. arroz integral, azeite" },
];

// ─── PLANO 28 DIAS ───────────────────────────────────────────────────────────
const PLAN_28 = [
  // SEMANA 1 — Fundamentos
  { day: 1, week: 1, title: "Fundamentos", exercises: [1, 2, 4], isRest: false, duration: "20 min" },
  { day: 2, week: 1, title: "Mobilidade", exercises: [3, 6, 9], isRest: false, duration: "22 min" },
  { day: 3, week: 1, title: "Fortalecimento", exercises: [1, 5, 7], isRest: false, duration: "22 min" },
  { day: 4, week: 1, title: "Descanso Ativo", exercises: [9, 12], isRest: true, duration: "10 min" },
  { day: 5, week: 1, title: "Equilíbrio", exercises: [2, 4, 8], isRest: false, duration: "20 min" },
  { day: 6, week: 1, title: "Pernas e Glúteos", exercises: [3, 7, 11], isRest: false, duration: "22 min" },
  { day: 7, week: 1, title: "Alongamento", exercises: [9, 6, 12], isRest: false, duration: "18 min" },
  // SEMANA 2 — Construção
  { day: 8, week: 2, title: "Construção I", exercises: [1, 2, 4, 10], isRest: false, duration: "26 min" },
  { day: 9, week: 2, title: "Flexibilidade+", exercises: [3, 6, 9, 11], isRest: false, duration: "25 min" },
  { day: 10, week: 2, title: "Glúteos e Core", exercises: [1, 5, 7, 8], isRest: false, duration: "28 min" },
  { day: 11, week: 2, title: "Descanso Ativo", exercises: [9, 12], isRest: true, duration: "10 min" },
  { day: 12, week: 2, title: "Core e Braços", exercises: [2, 4, 5, 12], isRest: false, duration: "27 min" },
  { day: 13, week: 2, title: "Pernas Completo", exercises: [3, 6, 10, 11], isRest: false, duration: "26 min" },
  { day: 14, week: 2, title: "Recuperação", exercises: [9, 11, 12], isRest: false, duration: "20 min" },
  // SEMANA 3 — Intensificação
  { day: 15, week: 3, title: "Corpo Todo I", exercises: [1, 2, 4, 5, 7], isRest: false, duration: "32 min" },
  { day: 16, week: 3, title: "Mobilidade+", exercises: [3, 6, 9, 10, 11], isRest: false, duration: "30 min" },
  { day: 17, week: 3, title: "Força+", exercises: [1, 4, 7, 8, 12], isRest: false, duration: "32 min" },
  { day: 18, week: 3, title: "Descanso Ativo", exercises: [9, 12], isRest: true, duration: "10 min" },
  { day: 19, week: 3, title: "Queima Total", exercises: [2, 5, 8, 10, 11], isRest: false, duration: "33 min" },
  { day: 20, week: 3, title: "Pernas e Quadris", exercises: [3, 6, 9, 11, 12], isRest: false, duration: "30 min" },
  { day: 21, week: 3, title: "Mobilidade Total", exercises: [6, 9, 10, 11, 12], isRest: false, duration: "28 min" },
  // SEMANA 4 — Pico
  { day: 22, week: 4, title: "Pico I", exercises: [1, 2, 4, 5, 7, 10], isRest: false, duration: "38 min" },
  { day: 23, week: 4, title: "Flexib. Total", exercises: [3, 6, 8, 9, 11, 12], isRest: false, duration: "36 min" },
  { day: 24, week: 4, title: "Força Total", exercises: [1, 4, 5, 7, 8, 10], isRest: false, duration: "38 min" },
  { day: 25, week: 4, title: "Descanso Ativo", exercises: [9, 12], isRest: true, duration: "10 min" },
  { day: 26, week: 4, title: "Pernas Completo", exercises: [2, 3, 6, 9, 11, 12], isRest: false, duration: "36 min" },
  { day: 27, week: 4, title: "Full Body+", exercises: [1, 4, 5, 7, 8, 10], isRest: false, duration: "38 min" },
  { day: 28, week: 4, title: "🏆 Conquista!", exercises: [1, 2, 3, 4, 5, 6], isRest: false, duration: "40 min" },
];

// Adiciona refeições a cada dia (rotação de 7)
PLAN_28.forEach((d, i) => {
  const r = i % 7;
  d.meals = {
    breakfast: BREAKFASTS[r],
    morningSnack: SNACKS[r],
    lunch: LUNCHES[r],
    afternoonSnack: SNACKS[(r + 3) % 7],
    dinner: DINNERS[r],
  };
  d.totalCals = d.meals.breakfast.cals + d.meals.morningSnack.cals + d.meals.lunch.cals + d.meals.afternoonSnack.cals + d.meals.dinner.cals;
  d.totalProt = d.meals.breakfast.prot + d.meals.morningSnack.prot + d.meals.lunch.prot + d.meals.afternoonSnack.prot + d.meals.dinner.prot;
  d.totalCarbs = d.meals.breakfast.carbs + d.meals.morningSnack.carbs + d.meals.lunch.carbs + d.meals.afternoonSnack.carbs + d.meals.dinner.carbs;
  d.totalFat = d.meals.breakfast.fat + d.meals.morningSnack.fat + d.meals.lunch.fat + d.meals.afternoonSnack.fat + d.meals.dinner.fat;
});

// ─── LISTA DE COMPRAS BRASIL ─────────────────────────────────────────────────
const SHOPPING_LIST = {
  "🥩 Proteínas": [
    "Peito de frango (congelado ou resfriado)",
    "Filé de tilápia ou merluza",
    "Salmão (fresco, congelado ou em lata)",
    "Atum em água (lata)",
    "Ovos caipiras ou orgânicos",
    "Queijo cottage ou ricota",
    "Iogurte grego natural (sem açúcar)",
    "Iogurte natural integral",
    "Grão-de-bico (lata ou seco)",
    "Lentilha (seca)",
  ],
  "🥦 Vegetais e Verduras": [
    "Brócolis (fresco ou congelado)",
    "Espinafre (fresco ou congelado)",
    "Couve",
    "Rúcula",
    "Alface americana",
    "Tomate",
    "Pepino",
    "Cenoura",
    "Beterraba",
    "Chuchu",
    "Abobrinha",
    "Pimentão colorido",
  ],
  "🍌 Frutas": [
    "Banana",
    "Maçã",
    "Laranja",
    "Mamão",
    "Morango",
    "Abacate",
    "Limão",
    "Frutas vermelhas congeladas",
  ],
  "🌾 Carboidratos": [
    "Arroz integral",
    "Macarrão integral",
    "Aveia em flocos",
    "Goma de tapioca",
    "Batata-doce",
    "Mandioca ou aipim",
    "Quinoa",
    "Pão integral (sem açúcar)",
    "Granola natural",
  ],
  "🥜 Gorduras Boas": [
    "Azeite de oliva extra virgem",
    "Pasta de amendoim integral (sem açúcar)",
    "Castanha-do-pará",
    "Nozes",
    "Chia",
    "Linhaça",
    "Amendoim natural (sem sal)",
  ],
  "🧂 Temperos e Outros": [
    "Alho",
    "Cebola",
    "Gengibre",
    "Canela em pó",
    "Mel puro",
    "Sal marinho",
    "Pimenta-do-reino",
    "Caldo de galinha caseiro (sem glutamato)",
    "Ervas frescas (cebolinha, salsinha, manjericão)",
  ],
};

// ─── UTILITÁRIOS ─────────────────────────────────────────────────────────────
function useStorage(key, def) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : def;
    } catch { return def; }
  });
  const update = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [val, update];
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [tab, setTab] = useState("plano");
  const [selectedDay, setSelectedDay] = useState(1);
  const [completedEx, setCompletedEx] = useStorage("pv_ex", {});
  const [completedMeals, setCompletedMeals] = useStorage("pv_meals", {});
  const [showFoodList, setShowFoodList] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [expandedEx, setExpandedEx] = useState(null);
  const [activeCategory, setActiveCategory] = useState(Object.keys(SHOPPING_LIST)[0]);
  const [splashFade, setSplashFade] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashFade(true), 2200);
    const t2 = setTimeout(() => setScreen("main"), 2800);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  function toggleEx(day, exId) {
    const key = `${day}-${exId}`;
    setCompletedEx(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function toggleMeal(day, mealType) {
    const key = `${day}-${mealType}`;
    setCompletedMeals(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const dayData = PLAN_28[selectedDay - 1];
  const totalCompletedDays = PLAN_28.filter((d, i) => {
    if (d.isRest) return true;
    const exDone = d.exercises.every(id => completedEx[`${d.day}-${id}`]);
    const mealsDone = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"].every(m => completedMeals[`${d.day}-${m}`]);
    return exDone && mealsDone;
  }).length;

  if (screen === "splash") return <Splash fade={splashFade} />;

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", paddingBottom: 80 }}>
      {showFoodList && <FoodListModal onClose={() => setShowFoodList(false)} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}
      {expandedMeal && <MealDetailModal meal={expandedMeal} dayKey={selectedDay} mealType={expandedMeal._type} completed={completedMeals[`${selectedDay}-${expandedMeal._type}`]} onToggle={() => { toggleMeal(selectedDay, expandedMeal._type); setExpandedMeal(null); }} onClose={() => setExpandedMeal(null)} />}
      {expandedEx && <ExerciseDetailModal ex={EXERCISES[expandedEx]} dayKey={selectedDay} completed={completedEx[`${selectedDay}-${expandedEx}`]} onToggle={() => { toggleEx(selectedDay, expandedEx); setExpandedEx(null); }} onClose={() => setExpandedEx(null)} />}

      {/* CONTEÚDO POR ABA */}
      {tab === "plano" && <TabPlano selectedDay={selectedDay} setSelectedDay={setSelectedDay} completedEx={completedEx} completedMeals={completedMeals} totalCompletedDays={totalCompletedDays} onGoWorkout={() => setTab("treinos")} onGoFood={() => setTab("comidas")} />}
      {tab === "treinos" && <TabTreinos dayData={dayData} selectedDay={selectedDay} completedEx={completedEx} onToggleEx={toggleEx} onExpandEx={setExpandedEx} />}
      {tab === "comidas" && <TabComidas dayData={dayData} selectedDay={selectedDay} completedMeals={completedMeals} onToggleMeal={toggleMeal} onExpandMeal={(meal, type) => setExpandedMeal({ ...meal, _type: type })} onShowFoodList={() => setShowFoodList(true)} />}
      {tab === "progresso" && <TabProgresso completedEx={completedEx} completedMeals={completedMeals} totalCompletedDays={totalCompletedDays} />}
      {tab === "perfil" && <TabPerfil />}

      {/* BARRA DE NAVEGAÇÃO */}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

// ─── SPLASH ──────────────────────────────────────────────────────────────────
function Splash({ fade }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FAF0E0 0%, #F5E6D0 50%, #EEDAD8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: fade ? 0 : 1, transition: "opacity 0.6s ease", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ width: 100, height: 100, borderRadius: 28, background: "linear-gradient(135deg, #C17D3C, #8B5E2A)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 40px rgba(193,125,60,0.35)" }}>
        <span style={{ fontSize: 50 }}>🧘‍♀️</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: -1 }}>CorpoVivo</h1>
        <p style={{ margin: "6px 0 0", color: "#8B7355", fontSize: 15 }}>Pilates em Casa · 28 Dias</p>
      </div>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: "#C17D3C", marginTop: 20, animation: "pulse 1s infinite" }} />
    </div>
  );
}

// ─── ABA: PLANO ───────────────────────────────────────────────────────────────
function TabPlano({ selectedDay, setSelectedDay, completedEx, completedMeals, totalCompletedDays, onGoWorkout, onGoFood }) {
  const todayData = PLAN_28[selectedDay - 1];
  const exDone = todayData.exercises.every(id => completedEx[`${selectedDay}-${id}`]);
  const mealTypes = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];
  const mealsDone = mealTypes.every(m => completedMeals[`${selectedDay}-${m}`]);
  const dayCompletePct = Math.round((totalCompletedDays / 28) * 100);

  return (
    <div style={{ padding: "20px 16px 10px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Meu Plano</h2>
          <p style={{ margin: "2px 0 0", color: C.textMuted, fontSize: 14 }}>28 Dias de Transformação</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{totalCompletedDays}/28</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>dias</div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div style={{ background: C.border, borderRadius: 8, height: 8, marginBottom: 22, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${dayCompletePct}%`, background: `linear-gradient(90deg, ${C.accent}, #D4956A)`, borderRadius: 8, transition: "width 0.5s ease" }} />
      </div>

      {/* Grade de 28 dias */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 24 }}>
        {PLAN_28.map((d) => {
          const exDoneDay = d.isRest || d.exercises.every(id => completedEx[`${d.day}-${id}`]);
          const mealsDoneDay = mealTypes.every(m => completedMeals[`${d.day}-${m}`]);
          const fullyDone = d.isRest ? exDoneDay : (exDoneDay && mealsDoneDay);
          const isSelected = d.day === selectedDay;
          return (
            <button key={d.day} onClick={() => setSelectedDay(d.day)} style={{ aspectRatio: "1", borderRadius: "50%", border: isSelected ? `3px solid ${C.accent}` : `2px solid ${fullyDone ? C.green : C.border}`, background: isSelected ? C.accent : fullyDone ? C.greenLight : d.isRest ? C.rest : C.card, color: isSelected ? "#FFF" : fullyDone ? C.green : d.isRest ? C.restText : C.textMuted, fontSize: 13, fontWeight: isSelected ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              {fullyDone && !isSelected ? "✓" : d.day}
            </button>
          );
        })}
      </div>

      {/* Card do dia selecionado */}
      <div style={{ background: C.card, borderRadius: 18, padding: 20, marginBottom: 14, boxShadow: `0 2px 16px ${C.shadow}`, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Semana {todayData.week} · Dia {todayData.day}</div>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.text }}>{todayData.title}</h3>
          </div>
          {todayData.isRest ? (
            <span style={{ background: C.rest, color: C.restText, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>Descanso</span>
          ) : (
            <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>{todayData.duration}</span>
          )}
        </div>

        {!todayData.isRest && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {todayData.exercises.map(id => (
                <span key={id} style={{ background: exDone ? C.greenLight : C.cardAlt, color: exDone ? C.green : C.textMuted, borderRadius: 10, padding: "4px 10px", fontSize: 12, fontWeight: 500 }}>
                  {completedEx[`${selectedDay}-${id}`] ? "✓ " : ""}{EXERCISES[id].name}
                </span>
              ))}
            </div>
            <button onClick={onGoWorkout} style={{ width: "100%", padding: "13px", background: exDone ? C.greenLight : C.primary, color: exDone ? C.green : "#FFF", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: 0.5 }}>
              {exDone ? "✓ Treino Concluído" : "IR AO TREINO"}
            </button>
          </>
        )}
      </div>

      {/* Card de nutrição do dia */}
      <div style={{ background: C.card, borderRadius: 18, padding: 20, boxShadow: `0 2px 16px rgba(0,0,0,0.06)`, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>Alimentação de Hoje</h3>
          <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{todayData.totalCals} kcal</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          {[["🥩 Prot.", `${todayData.totalProt}g`], ["🌾 Carbs", `${todayData.totalCarbs}g`], ["🥑 Gordura", `${todayData.totalFat}g`]].map(([label, val]) => (
            <div key={label} style={{ textAlign: "center", background: C.cardAlt, borderRadius: 12, padding: "10px 6px" }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{label.split(" ")[0]}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{val}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{label.split(" ")[1]}</div>
            </div>
          ))}
        </div>
        <button onClick={onGoFood} style={{ width: "100%", padding: "13px", background: mealsDone ? C.greenLight : C.primary, color: mealsDone ? C.green : "#FFF", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: 0.5 }}>
          {mealsDone ? "✓ Alimentação Registrada" : "VER REFEIÇÕES"}
        </button>
      </div>
    </div>
  );
}

// ─── ABA: TREINOS ─────────────────────────────────────────────────────────────
function TabTreinos({ dayData, selectedDay, completedEx, onToggleEx, onExpandEx }) {
  const exercisesDone = dayData.exercises.filter(id => completedEx[`${selectedDay}-${id}`]).length;
  const total = dayData.exercises.length;

  return (
    <div style={{ padding: "20px 16px 10px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Treinos</h2>
        <p style={{ margin: "2px 0 0", color: C.textMuted, fontSize: 14 }}>Dia {selectedDay} · {dayData.title}</p>
      </div>

      {/* Progresso do dia */}
      {!dayData.isRest && (
        <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 18, display: "flex", alignItems: "center", gap: 14, border: `1px solid ${C.border}` }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: exercisesDone === total ? C.greenLight : C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>{exercisesDone === total ? "🏆" : "🏋️‍♀️"}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{exercisesDone}/{total} exercícios concluídos</div>
            <div style={{ marginTop: 6, background: C.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${total ? (exercisesDone / total) * 100 : 0}%`, background: exercisesDone === total ? C.green : C.accent, borderRadius: 4, transition: "width 0.3s" }} />
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.accent, fontWeight: 700 }}>{dayData.duration}</div>
        </div>
      )}

      {dayData.isRest ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: C.rest, borderRadius: 20, marginBottom: 18 }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🌸</div>
          <h3 style={{ margin: "0 0 8px", color: C.restText, fontSize: 20, fontWeight: 800 }}>Dia de Descanso Ativo</h3>
          <p style={{ margin: 0, color: "#5B8DB0", fontSize: 15, lineHeight: 1.5 }}>Seu corpo precisa se recuperar para crescer mais forte. Faça caminhada leve, alongamentos ou simplesmente descanse. Você merece! 💆‍♀️</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {dayData.exercises.map((id) => {
            const ex = EXERCISES[id];
            const done = completedEx[`${selectedDay}-${id}`];
            return (
              <div key={id} style={{ background: C.card, borderRadius: 16, overflow: "hidden", border: `1px solid ${done ? C.green : C.border}`, boxShadow: `0 2px 10px rgba(0,0,0,0.05)` }}>
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ width: 110, height: 110, flexShrink: 0, position: "relative" }}>
                    <img src={ex.image} alt={ex.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = "none"; }} />
                    {done && <div style={{ position: "absolute", inset: 0, background: "rgba(39,174,96,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 32, color: "#fff" }}>✓</span></div>}
                  </div>
                  <div style={{ flex: 1, padding: "12px 12px 8px" }}>
                    <div style={{ fontSize: 13, color: C.accent, fontWeight: 600, marginBottom: 2 }}>{ex.muscle}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6, lineHeight: 1.2 }}>{ex.name}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: C.textMuted }}>⏱ {ex.duration}</span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>🔁 {ex.sets}</span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>🔥 {ex.calories} kcal</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => onExpandEx(id)} style={{ flex: 1, padding: "7px", background: C.cardAlt, color: C.textMuted, borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        VER DETALHES ›
                      </button>
                      <button onClick={() => onToggleEx(selectedDay, id)} style={{ flex: 1, padding: "7px", background: done ? C.green : C.primary, color: "#FFF", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {done ? "✓ FEITO" : "+ REGISTRAR"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exercícios de descanso (alongamentos leves) */}
      {dayData.isRest && (
        <div style={{ marginTop: 0 }}>
          <h4 style={{ color: C.textMuted, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Sugestões para hoje:</h4>
          {[9, 12].map(id => {
            const ex = EXERCISES[id];
            return (
              <div key={id} style={{ background: C.card, borderRadius: 16, padding: "14px 16px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: C.rest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌿</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{ex.muscle} · {ex.duration}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ABA: COMIDAS ─────────────────────────────────────────────────────────────
function TabComidas({ dayData, selectedDay, completedMeals, onToggleMeal, onExpandMeal, onShowFoodList }) {
  const meals = [
    { type: "breakfast", label: "Café da Manhã", icon: "🌅", time: "07:00" },
    { type: "morningSnack", label: "Lanche da Manhã", icon: "🍎", time: "10:00" },
    { type: "lunch", label: "Almoço", icon: "🍽️", time: "13:00" },
    { type: "afternoonSnack", label: "Lanche da Tarde", icon: "🥜", time: "16:00" },
    { type: "dinner", label: "Jantar", icon: "🌙", time: "19:00" },
  ];
  const mealsDone = meals.filter(m => completedMeals[`${selectedDay}-${m.type}`]).length;

  return (
    <div style={{ padding: "20px 16px 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Comidas</h2>
          <p style={{ margin: "2px 0 0", color: C.textMuted, fontSize: 14 }}>Dia {selectedDay} · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
      </div>

      {/* Resumo de macros do dia */}
      <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 18, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Total do dia</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>{dayData.totalCals} kcal</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[["Proteína", dayData.totalProt, "#3498DB"], ["Carbs", dayData.totalCarbs, "#E67E22"], ["Gordura", dayData.totalFat, "#9B59B6"]].map(([label, val, color]) => (
            <div key={label} style={{ textAlign: "center", padding: "8px 4px", background: C.cardAlt, borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}g</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(mealsDone / 5) * 100}%`, background: mealsDone === 5 ? C.green : C.accent, borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 12, color: C.textMuted, flexShrink: 0 }}>{mealsDone}/5 refeições</span>
        </div>
      </div>

      {/* Lista de refeições */}
      {meals.map(({ type, label, icon, time }) => {
        const meal = dayData.meals[type];
        const done = completedMeals[`${selectedDay}-${type}`];
        return (
          <div key={type} style={{ background: C.card, borderRadius: 16, marginBottom: 12, border: `1px solid ${done ? C.green : C.border}`, overflow: "hidden", boxShadow: `0 2px 10px rgba(0,0,0,0.04)` }}>
            <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
              <div style={{ width: 90, flexShrink: 0 }}>
                <img src={meal.image} alt={meal.name} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 90, display: "block" }} onError={e => { e.target.style.background = C.cardAlt; e.target.src = ""; }} />
              </div>
              <div style={{ flex: 1, padding: "12px 12px 8px" }}>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}>{icon} {label} · {time}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{meal.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{meal.cals} kcal &nbsp;|&nbsp; {meal.prot}g prot. &nbsp;|&nbsp; {meal.carbs}g carbs</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => onExpandMeal(meal, type)} style={{ flex: 1, padding: "6px", background: C.cardAlt, color: C.textMuted, borderRadius: 20, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    VER DETALHES ›
                  </button>
                  <button onClick={() => onToggleMeal(selectedDay, type)} style={{ flex: 1, padding: "6px", background: done ? C.green : C.primary, color: "#FFF", borderRadius: 20, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {done ? "✓ REGISTRADO" : "+ REGISTRAR"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Botão lista de compras */}
      <button onClick={onShowFoodList} style={{ width: "100%", padding: "15px", background: C.card, color: C.accent, borderRadius: 30, border: `2px solid ${C.accent}`, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 6, letterSpacing: 0.3 }}>
        🛒 LISTA DE ALIMENTOS BRASILEIROS
      </button>
    </div>
  );
}

// ─── ABA: PROGRESSO ──────────────────────────────────────────────────────────
function TabProgresso({ completedEx, completedMeals, totalCompletedDays }) {
  const mealTypes = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];
  const stats = PLAN_28.map((d) => {
    const exDone = d.isRest ? d.exercises.length : d.exercises.filter(id => completedEx[`${d.day}-${id}`]).length;
    const mealsDone = mealTypes.filter(m => completedMeals[`${d.day}-${m}`]).length;
    const fullyDone = d.isRest ? true : (exDone === d.exercises.length && mealsDone === 5);
    return { ...d, exDone, mealsDone, fullyDone };
  });

  const totalExDone = Object.keys(completedEx).filter(k => completedEx[k]).length;
  const totalMealsDone = Object.keys(completedMeals).filter(k => completedMeals[k]).length;
  const calsBurned = Object.keys(completedEx).filter(k => completedEx[k]).reduce((sum, key) => {
    const exId = parseInt(key.split("-")[1]);
    return sum + (EXERCISES[exId]?.calories || 0);
  }, 0);

  return (
    <div style={{ padding: "20px 16px 10px" }}>
      <h2 style={{ margin: "0 0 18px", fontSize: 26, fontWeight: 800, color: C.text }}>Progresso</h2>

      {/* Cards de estatísticas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
        {[
          ["🏆", "Dias Completos", totalCompletedDays, "/ 28"],
          ["🔥", "Calorias Queimadas", calsBurned, "kcal"],
          ["💪", "Exercícios Feitos", totalExDone, "registros"],
          ["🥗", "Refeições Feitas", totalMealsDone, "registros"],
        ].map(([icon, label, val, unit]) => (
          <div key={label} style={{ background: C.card, borderRadius: 16, padding: "16px 14px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{val}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
            <div style={{ fontSize: 11, color: C.border }}>{unit}</div>
          </div>
        ))}
      </div>

      {/* Checklist dos 28 dias */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>Checklist de Dias</h3>
      {[1, 2, 3, 4].map(week => (
        <div key={week} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Semana {week}</div>
          {stats.filter(d => d.week === week).map(d => (
            <div key={d.day} style={{ background: C.card, borderRadius: 14, padding: "12px 14px", marginBottom: 8, border: `1px solid ${d.fullyDone ? C.green : C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: d.fullyDone ? C.greenLight : d.isRest ? C.rest : C.cardAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: d.fullyDone ? C.green : d.isRest ? C.restText : C.textMuted }}>{d.fullyDone ? "✓" : d.day}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{d.title}</div>
                {!d.isRest && (
                  <div style={{ fontSize: 12, color: C.textMuted }}>{d.exDone}/{d.exercises.length} exerc. · {d.mealsDone}/5 refeições</div>
                )}
              </div>
              {d.fullyDone && <span style={{ color: C.green, fontSize: 18 }}>✅</span>}
              {d.isRest && !d.fullyDone && <span style={{ fontSize: 14, color: C.restText }}>🌸</span>}
            </div>
          ))}
        </div>
      ))}

      {totalCompletedDays === 28 && (
        <div style={{ textAlign: "center", padding: "30px 20px", background: "linear-gradient(135deg, #FFF8E7, #FFF0D4)", borderRadius: 20, marginTop: 10, border: `2px solid ${C.accent}` }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🏆</div>
          <h3 style={{ margin: "0 0 8px", color: C.accent, fontSize: 22, fontWeight: 800 }}>Parabéns! Você completou os 28 dias!</h3>
          <p style={{ margin: 0, color: C.textMuted, fontSize: 15 }}>Você é incrível! Continue com seus novos hábitos saudáveis. 🌟</p>
        </div>
      )}
    </div>
  );
}

// ─── ABA: PERFIL ──────────────────────────────────────────────────────────────
function TabPerfil() {
  return (
    <div style={{ padding: "20px 16px 10px" }}>
      <h2 style={{ margin: "0 0 20px", fontSize: 26, fontWeight: 800, color: C.text }}>Perfil</h2>

      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, #8B5E2A)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 40 }}>🧘‍♀️</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Bem-vinda!</div>
        <div style={{ fontSize: 14, color: C.textMuted }}>Pilates em Casa · 28 Dias</div>
      </div>

      {/* Plano ativo */}
      <div style={{ background: C.card, borderRadius: 18, padding: 18, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <span style={{ background: C.greenLight, color: C.green, fontWeight: 700, fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>ATIVO</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 14 }}>Plano de Pilates em Casa — 28 Dias</div>
        {[
          ["Período do programa", "28 dias"],
          ["Nível", "Iniciante ao Avançado"],
          ["Frequência", "6x por semana"],
          ["Duração por dia", "20-40 min"],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: C.textMuted }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Sobre o programa */}
      <div style={{ background: C.card, borderRadius: 18, padding: 18, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: C.text }}>Sobre o Programa</h3>
        <p style={{ margin: "0 0 10px", fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Este programa foi desenvolvido especialmente para mulheres entre 35 e 65 anos que querem tonificar o corpo, melhorar a postura e ganhar mais energia — tudo isso em casa, sem precisar de equipamentos.</p>
        <p style={{ margin: 0, fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>Combine os exercícios de pilates com o plano nutricional personalizado e veja sua transformação em 28 dias! 💪</p>
      </div>

      {/* Dicas */}
      <div style={{ background: C.accentLight, borderRadius: 18, padding: 18, border: `1px solid ${C.border}` }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: C.accent }}>💡 Dicas Importantes</h3>
        {[
          "Hidrate-se bem: beba 2L de água por dia",
          "Durma pelo menos 7-8 horas por noite",
          "Respeite os dias de descanso — eles são essenciais!",
          "Siga o plano alimentar para melhores resultados",
          "Não desista! Os primeiros 7 dias são os mais difíceis",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 14, color: "#7A5230", lineHeight: 1.4 }}>
            <span style={{ flexShrink: 0 }}>✦</span> {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODAL: DETALHES DO EXERCÍCIO ────────────────────────────────────────────
function ExerciseDetailModal({ ex, completed, onToggle, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", maxWidth: 430, width: "100%", maxHeight: "88vh", overflow: "auto", paddingBottom: 30 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2 }} />
        </div>
        <img src={ex.image} alt={ex.name} style={{ width: "100%", height: 220, objectFit: "cover", marginTop: 10 }} />
        <div style={{ padding: "20px 20px 10px" }}>
          <div style={{ fontSize: 13, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{ex.muscle}</div>
          <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, color: C.text }}>{ex.name}</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            {[["⏱", ex.duration], ["🔁", ex.sets], ["🔥", `${ex.calories} kcal`], ["📊", ex.level]].map(([icon, val]) => (
              <span key={val} style={{ background: C.cardAlt, color: C.textMuted, borderRadius: 20, padding: "6px 12px", fontSize: 13, fontWeight: 500 }}>{icon} {val}</span>
            ))}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>Como fazer:</h3>
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: "0 0 14px" }}>{ex.instructions}</p>
          <div style={{ background: C.accentLight, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>💡 Dica: </span>
            <span style={{ fontSize: 13, color: "#7A5230" }}>{ex.tips}</span>
          </div>
          <button onClick={onToggle} style={{ width: "100%", padding: "15px", background: completed ? C.green : C.primary, color: "#FFF", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
            {completed ? "✓ Exercício Concluído!" : "+ REGISTRAR EXERCÍCIO"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: DETALHES DA REFEIÇÃO ─────────────────────────────────────────────
function MealDetailModal({ meal, completed, onToggle, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", maxWidth: 430, width: "100%", maxHeight: "88vh", overflow: "auto", paddingBottom: 30 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2 }} />
        </div>
        <img src={meal.image} alt={meal.name} style={{ width: "100%", height: 200, objectFit: "cover", marginTop: 10 }} />
        <div style={{ padding: "20px 20px 10px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800, color: C.text }}>{meal.name}</h2>
          {/* Macros */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
            {[["🔥", meal.cals, "kcal"], ["🥩", meal.prot + "g", "Prot."], ["🌾", meal.carbs + "g", "Carbs"], ["🥑", meal.fat + "g", "Gordura"]].map(([icon, val, label]) => (
              <div key={label} style={{ textAlign: "center", background: C.cardAlt, borderRadius: 12, padding: "10px 4px" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{val}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>Ingredientes:</h3>
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: "0 0 20px", background: C.cardAlt, padding: "12px 14px", borderRadius: 12 }}>{meal.ingredients}</p>
          <button onClick={onToggle} style={{ width: "100%", padding: "15px", background: completed ? C.green : C.primary, color: "#FFF", borderRadius: 30, border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
            {completed ? "✓ Refeição Registrada!" : "+ REGISTRAR REFEIÇÃO"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: LISTA DE ALIMENTOS ───────────────────────────────────────────────
function FoodListModal({ onClose, activeCategory, setActiveCategory }) {
  const categories = Object.keys(SHOPPING_LIST);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", maxWidth: 430, width: "100%", maxHeight: "88vh", display: "flex", flexDirection: "column", paddingBottom: 30 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2 }} />
        </div>
        <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: C.text }}>🛒 Lista de Alimentos</h2>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textMuted }}>Fáceis de encontrar em qualquer mercado do Brasil</p>
          {/* Categorias */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${activeCategory === cat ? C.accent : C.border}`, background: activeCategory === cat ? C.accentLight : C.card, color: activeCategory === cat ? C.accent : C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Lista */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>
          {SHOPPING_LIST[activeCategory].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < SHOPPING_LIST[activeCategory].length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 15, color: C.text }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAVIGATION ────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const items = [
    { id: "plano", label: "Plano", icon: "📋" },
    { id: "treinos", label: "Treinos", icon: "🏋️" },
    { id: "comidas", label: "Comidas", icon: "🥗" },
    { id: "progresso", label: "Progresso", icon: "📊" },
    { id: "perfil", label: "Perfil", icon: "👤" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: C.tabBg, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 50, boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
      {items.map(({ id, label, icon }) => {
        const active = tab === id;
        return (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "10px 4px 12px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? C.accent : C.textMuted, letterSpacing: 0.2 }}>{label}</span>
            {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, marginTop: 1 }} />}
          </button>
        );
      })}
    </div>
  );
}
