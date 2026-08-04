export type MidiaMock = {
  id: string;
  tipo: "foto" | "video";
  url: string;
  nome_convidado: string | null;
  mensagem: string | null;
  cidade_evento?: string;
  criado_em: string;
};

export const CANDIDATO_INFO = {
  nome: "Tom Máximo",
  cargo: "Deputado Estadual",
  numero: "55.123",
  slogan: "Coragem para Mudar, Compromisso com Você!",
  partido: "Partido da Renovação",
  biografia: "Liderança comunitária, gestor com foco no desenvolvimento regional, defesa da saúde pública e apoio à juventude no estado da Bahia.",
  fotoPerfil: "/candidato fake/1.png",
  propostas: [
    {
      titulo: "Saúde & Qualidade de Vida",
      descricao: "Aceleração de consultas e exames com ampliação de AMEs regionais e suporte continuado às Santas Casas.",
      icone: "HeartPulse"
    },
    {
      titulo: "Educação & Oportunidades",
      descricao: "Mais vagas em Etecs e Fatecs, cursos técnicos integrados ao mercado e apoio ao primeiro emprego.",
      icone: "GraduationCap"
    },
    {
      titulo: "Emprego & Empreendedorismo",
      descricao: "Incentivo aos pequenos negócios municipais, simplificação tributária e atração de investimentos.",
      icone: "TrendingUp"
    },
    {
      titulo: "Transparência & Gestão Eficiente",
      descricao: "Participação popular na destinação de emendas e fiscalização rigorosa das obras estaduais.",
      icone: "ShieldCheck"
    }
  ],
  redesSociais: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me/5511999999999",
    youtube: "https://youtube.com"
  }
};

export const MOCK_MIDIAS: MidiaMock[] = [
  {
    id: "mock-1",
    tipo: "foto",
    url: "/candidato fake/1.png",
    nome_convidado: "Carlos Eduardo",
    cidade_evento: "Comício no Centro",
    mensagem: "O Tom Máximo representa a verdadeira renovação que o nosso estado precisa! Conte com o meu voto 55.123!",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "mock-2",
    tipo: "foto",
    url: "/candidato fake/2.png",
    nome_convidado: "Fernanda Lima",
    cidade_evento: "Caminhada com Feirantes",
    mensagem: "Excelente conversa sobre fortalecimento do comércio local. Tamo junto Tom!",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "mock-3",
    tipo: "foto",
    url: "/candidato fake/3.png",
    nome_convidado: "Lucas Mendes",
    cidade_evento: "Encontro com a Juventude",
    mensagem: "Propostas reais de capacitação e primeiro emprego pra nossa juventude!",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "mock-4",
    tipo: "foto",
    url: "/candidato fake/4.png",
    nome_convidado: "Dona Tereza & Família",
    cidade_evento: "Reunião de Lideranças",
    mensagem: "Tom é um homem de palavra e compromisso com o povo do nosso estado.",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "mock-5",
    tipo: "foto",
    url: "/candidato fake/5.png",
    nome_convidado: "Roberto Souza",
    cidade_evento: "Carreata da Vitória",
    mensagem: "A cidade em peso mobilizada pelo 55.123! Rumo à Assembleia Legislativa!",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "mock-6",
    tipo: "foto",
    url: "/candidato fake/6.png",
    nome_convidado: "Juliana Paes",
    cidade_evento: "Polo Industrial",
    mensagem: "Incentivo à geração de novos postos de trabalho e renda para nossa gente.",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];
