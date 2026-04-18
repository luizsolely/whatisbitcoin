import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'pt' | 'en';

const translations = {
  pt: {
    // Navbar
    'nav.origin':     'Origem',
    'nav.timeline':   'Timeline',
    'nav.technology': 'Tecnologia',
    'nav.impact':     'Impacto',
    'nav.market':     'Mercado ao Vivo →',
    'nav.back':       '← Voltar',

    // Hero
    'hero.badge':   'Est. 2009 · Bloco #0',
    'hero.title1':  'O que é',
    'hero.title2':  'Bitcoin?',
    'hero.sub':     'A história de uma moeda nascida da crise, construída sobre matemática e projetada para sobreviver a todas as instituições que tentaram detê-la.',
    'hero.cta':     'Explorar a História',
    'hero.scroll':  'Rolar',

    // Stats
    'stats.supply':  'Oferta Total Máxima',
    'stats.genesis': 'Ano de Criação',
    'stats.price':   'Jornada de Preço',
    'stats.wallets': 'Carteiras Criadas',

    // Origin
    'origin.label':           'Capítulo 01 — Gênese',
    'origin.title1':          'Por que o Bitcoin',
    'origin.title2':          'foi Criado?',
    'origin.p1':              'Era outubro de 2008. O sistema financeiro global estava entrando em colapso. Bancos considerados "grandes demais para falir" estavam falindo. Governos imprimiam dinheiro para salvar as próprias instituições que causaram a crise.',
    'origin.p2':              'Nesse momento de falha sistêmica, surgiu uma figura anônima — ou possivelmente um grupo — usando o pseudônimo <strong>Satoshi Nakamoto</strong>. Em uma lista de e-mails de criptografia, Satoshi compartilhou um documento de nove páginas descrevendo uma ideia radicalmente nova.',
    'origin.p3':              'Uma forma de dinheiro que não precisava de banco, governo ou terceiro de confiança. Uma moeda governada inteiramente por matemática e prova criptográfica. Um sistema onde as transações eram finais, transparentes e resistentes à censura.',
    'origin.p4':              'As motivações estavam incorporadas no próprio código. No primeiro bloco do Bitcoin — o Bloco Gênese — Satoshi incluiu uma mensagem: <em>"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks."</em> Não apenas um timestamp. Um manifesto.',
    'origin.whitepaper.title': 'O Whitepaper',
    'origin.whitepaper.text':  'Publicado anonimamente em 31 de outubro de 2008 — Dia das Bruxas — o paper de Satoshi propôs "uma versão puramente peer-to-peer de dinheiro eletrônico" que permitiria pagamentos online sem passar por uma instituição financeira.',
    'origin.whitepaper.link':  'Ler o Paper Original →',
    'origin.quote':            'O problema fundamental com a moeda convencional é toda a confiança necessária para fazê-la funcionar.',

    // Timeline
    'timeline.label':  'Capítulo 02 — A Jornada',
    'timeline.title1': '15 Anos de',
    'timeline.title2': 'História',
    'timeline.desc':   'De nove páginas em uma lista de e-mails a uma classe de ativos trilionária — cada momento definidor.',

    // Timeline events
    'tl.2008.title': 'O Whitepaper',
    'tl.2008.desc':  'Em 31 de outubro, uma entidade conhecida como Satoshi Nakamoto publicou "Bitcoin: Um Sistema de Dinheiro Eletrônico Peer-to-Peer." Nove páginas que mudariam as finanças para sempre. O mundo estava em meio a uma crise bancária — o momento não foi coincidência.',
    'tl.2009.title': 'O Bloco Gênese',
    'tl.2009.desc':  'Em 3 de janeiro, o primeiro bloco Bitcoin foi minerado. Nele estava gravada uma manchete do The Times — "Chancellor on brink of second bailout for banks." Uma declaração de intenção, gravada na blockchain para a eternidade.',
    'tl.2010.title': 'A Primeira Transação Real',
    'tl.2010.desc':  'O programador Laszlo Hanyecz pagou 10.000 BTC por duas pizzas — a primeira transação comercial conhecida. Essas moedas valeriam depois mais de $700 milhões. Todo 22 de maio é celebrado como o Dia da Pizza Bitcoin.',
    'tl.2011.title': 'Paridade com o Dólar',
    'tl.2011.desc':  'O Bitcoin chegou a $1 USD pela primeira vez, atingindo paridade com a principal moeda de reserva mundial. A Silk Road foi lançada, expondo o Bitcoin à controvérsia. A Mt. Gox se tornou a exchange dominante.',
    'tl.2013.title': 'Primeira Bolha',
    'tl.2013.desc':  'O Bitcoin ultrapassou $1.000 pela primeira vez, capturando manchetes mainstream. A crise bancária de Chipre impulsionou a demanda, com cidadãos buscando alternativas a um sistema financeiro em colapso.',
    'tl.2017.title': 'O Grande Bull Run',
    'tl.2017.desc':  'O Bitcoin chegou perto de $20.000, desencadeando um frenesi global. ICOs inundaram o mercado. Negociação de futuros foi lançada na CME. Olhos institucionais se voltaram para as criptomoedas pela primeira vez.',
    'tl.2021.title': 'Adoção Institucional',
    'tl.2021.desc':  'MicroStrategy, Tesla e Square adicionaram Bitcoin aos seus balanços. El Salvador o tornou moeda legal — a primeira nação a fazê-lo. O Bitcoin atingiu o pico acima de $68.000. Uma nova era havia começado.',
    'tl.2024.title': 'A Era dos ETFs',
    'tl.2024.desc':  'A SEC aprovou os ETFs spot de Bitcoin em janeiro, abrindo as comportas para o capital de varejo e institucional. BlackRock, Fidelity e outros gigantes entraram no mercado. O Bitcoin voltou a bater recordes históricos.',

    // Technology
    'tech.label':  'Capítulo 03 — A Máquina',
    'tech.title1': 'Como',
    'tech.title2': 'Funciona?',
    'tech.desc':   'Quatro pilares que tornam o Bitcoin diferente de tudo que o mundo tinha visto antes.',

    // Pillars
    'pillar.decentralization.title': 'Descentralização',
    'pillar.decentralization.desc':  'Nenhuma autoridade central controla o Bitcoin. Ele roda em milhares de nós distribuídos pelo mundo — resistente à censura por design.',
    'pillar.blockchain.title':       'Blockchain',
    'pillar.blockchain.desc':        'Cada transação é registrada em um livro público imutável. Transparente, permanente e verificável por qualquer pessoa na Terra.',
    'pillar.pow.title':              'Prova de Trabalho',
    'pillar.pow.desc':               'Mineradores competem para resolver quebra-cabeças criptográficos, protegendo a rede e recebendo novos Bitcoins como recompensa.',
    'pillar.halving.title':          'O Halving',
    'pillar.halving.desc':           'A cada ~4 anos, a recompensa de mineração é cortada pela metade. Essa escassez controlada imita o ouro — e impulsiona os ciclos de preço do Bitcoin.',

    'tech.rule.title':      'A Regra dos 21 Milhões',
    'tech.rule.text':       'Nunca existirão mais de 21.000.000 de Bitcoins. Esse limite máximo — gravado no código do protocolo — é o que torna o Bitcoin o dinheiro mais escasso já criado. Sem inflação. Sem exceções. Nenhum banco central pode mudar isso.',
    'tech.supply.mined':    'Minerado: ~19.7M',
    'tech.supply.remaining':'Restante: ~1.3M',

    // Impact
    'impact.label':  'Capítulo 04 — O Legado',
    'impact.title1': 'Uma Revolução',
    'impact.title2': 'Ainda em Curso',

    'impact.inclusion.title': 'Inclusão Financeira',
    'impact.inclusion.desc':  'Mais de 1,4 bilhão de adultos no mundo permanecem sem acesso a bancos. O Bitcoin requer apenas um smartphone e internet — sem identidade, sem histórico de crédito, sem agência bancária. Pela primeira vez, qualquer pessoa pode participar da economia global em igualdade de condições.',
    'impact.sovereignty.title': 'Soberania Monetária',
    'impact.sovereignty.desc':  'Cidadãos em países com hiperinflação — Venezuela, Argentina, Líbano, Zimbabwe — recorreram ao Bitcoin enquanto suas economias eram destruídas. Tornou-se não apenas um investimento, mas uma tábua de salvação.',
    'impact.institutional.title': 'Capital Institucional',
    'impact.institutional.desc':  'De hedge funds a fundos soberanos, as maiores instituições financeiras do mundo agora detêm ou oferecem exposição ao Bitcoin. A narrativa mudou de "dinheiro de internet" para "ouro digital" para "ativo de reserva".',
    'impact.tech.title': 'Legado Tecnológico',
    'impact.tech.desc':  'A tecnologia blockchain do Bitcoin acendeu um ecossistema inteiro — contratos inteligentes, DeFi, NFTs e muito mais. Goste ou não deles, nenhum existiria sem a visão original de Satoshi.',

    // CTA
    'cta.title': 'A história ainda está sendo escrita.',
    'cta.sub':   'Cada bloco minerado adiciona um novo capítulo. A revolução continua.',
    'cta.btn':   'Ver o Timeline Completo',

    // Footer
    'footer.note':   'Um arquivo educacional dedicado à história, tecnologia e impacto do Bitcoin. Não é conselho financeiro. Não é conselho de investimento. Apenas a verdade sobre uma revolução.',
    'footer.block':  'Altura do bloco:',
    'footer.prices': 'Preços via CoinGecko API',

    // Market
    'market.connecting':      'Conectando ao feed ao vivo...',
    'market.live':            'AO VIVO',
    'market.connecting_badge':'CONECTANDO...',
    'market.updated':         'Última atualização:',
    'market.marketcap':       'Cap. de Mercado',
    'market.volume':          'Volume 24h',
    'market.btcprice':        'Preço BTC',
    'market.change':          'Variação 24h',
    'market.history':         'Histórico de Preços',

    'market.alerts.label':      'Alertas de Preço',
    'market.alerts.title1':     'Seja notificado quando',
    'market.alerts.title2':     'o Bitcoin se mover.',
    'market.alerts.desc':       'Defina um preço alvo e enviaremos um e-mail no momento em que o Bitcoin cruzá-lo. Sem conta necessária.',
    'market.alerts.success':    '✓ Alerta registrado! Você receberá um e-mail quando seu alvo for atingido.',
    'market.alerts.email':      'E-mail',
    'market.alerts.price':      'Preço Alvo (USD)',
    'market.alerts.condition':  'Condição',
    'market.alerts.above':      'Preço sobe acima de',
    'market.alerts.below':      'Preço cai abaixo de',
    'market.alerts.btn':        'Criar Alerta',
    'market.alerts.registering':'Registrando...',
    'market.alerts.error':      'Falha ao registrar alerta. Tente novamente.',
  },

  en: {
    // Navbar
    'nav.origin':     'Origin',
    'nav.timeline':   'Timeline',
    'nav.technology': 'Technology',
    'nav.impact':     'Impact',
    'nav.market':     'Live Market →',
    'nav.back':       '← Back',

    // Hero
    'hero.badge':   'Est. 2009 · Block #0',
    'hero.title1':  'What Is',
    'hero.title2':  'Bitcoin?',
    'hero.sub':     'The story of a currency born from crisis, built on mathematics, and designed to outlast every institution that ever tried to stop it.',
    'hero.cta':     'Explore the Story',
    'hero.scroll':  'Scroll',

    // Stats
    'stats.supply':  'Total Supply Cap',
    'stats.genesis': 'Year of Genesis',
    'stats.price':   'Price Journey',
    'stats.wallets': 'Wallets Created',

    // Origin
    'origin.label':           'Chapter 01 — Genesis',
    'origin.title1':          'Why Was Bitcoin',
    'origin.title2':          'Created?',
    'origin.p1':              'It was October 2008. The global financial system was collapsing. Banks that had been deemed "too big to fail" were failing. Governments were printing money to bail out the very institutions that caused the crisis.',
    'origin.p2':              'Into this moment of systemic failure stepped an anonymous figure — or possibly a group — using the pseudonym <strong>Satoshi Nakamoto</strong>. On a cryptography mailing list, Satoshi shared a nine-page document describing a radical new idea.',
    'origin.p3':              'A form of money that required no bank, no government, no trusted third party. A currency governed entirely by mathematics and cryptographic proof. A system where transactions were final, transparent, and censorship-resistant.',
    'origin.p4':              'The motivations were embedded in the code itself. In Bitcoin\'s very first block — the Genesis Block — Satoshi included a message: <em>"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks."</em> Not just a timestamp. A manifesto.',
    'origin.whitepaper.title': 'The Whitepaper',
    'origin.whitepaper.text':  'Published anonymously on October 31, 2008 — Halloween — Satoshi\'s paper proposed "a purely peer-to-peer version of electronic cash" that would allow online payments without going through a financial institution.',
    'origin.whitepaper.link':  'Read the Original Paper →',
    'origin.quote':            'The root problem with conventional currency is all the trust that\'s required to make it work.',

    // Timeline
    'timeline.label':  'Chapter 02 — The Journey',
    'timeline.title1': '15 Years of',
    'timeline.title2': 'History',
    'timeline.desc':   'From nine pages on a mailing list to a trillion-dollar asset class — every defining moment.',

    // Timeline events
    'tl.2008.title': 'The Whitepaper',
    'tl.2008.desc':  'On October 31st, an entity known as Satoshi Nakamoto published "Bitcoin: A Peer-to-Peer Electronic Cash System." Nine pages that would change finance forever. The world was in the midst of a banking crisis — the timing was not a coincidence.',
    'tl.2009.title': 'Genesis Block',
    'tl.2009.desc':  'On January 3rd, the first Bitcoin block was mined. Embedded in it: a headline from The Times — "Chancellor on brink of second bailout for banks." A declaration of intent, carved into the blockchain for eternity.',
    'tl.2010.title': 'First Real Transaction',
    'tl.2010.desc':  'Programmer Laszlo Hanyecz paid 10,000 BTC for two pizzas — the first known commercial transaction. Those coins would later be worth over $700 million. Every May 22nd is now celebrated as Bitcoin Pizza Day.',
    'tl.2011.title': 'Parity with the Dollar',
    'tl.2011.desc':  'Bitcoin reached $1 USD for the first time, achieving parity with the world\'s reserve currency. Silk Road launched, exposing Bitcoin to controversy. Mt. Gox becomes the dominant exchange.',
    'tl.2013.title': 'First Bubble',
    'tl.2013.desc':  'Bitcoin surged past $1,000 for the first time, capturing mainstream headlines. The Cyprus banking crisis drove demand as citizens sought alternatives to a collapsing financial system.',
    'tl.2017.title': 'The Great Bull Run',
    'tl.2017.desc':  'Bitcoin reached nearly $20,000, igniting a global frenzy. ICOs flooded the market. Futures trading launched on the CME. Institutional eyes turned toward crypto for the first time.',
    'tl.2021.title': 'Institutional Adoption',
    'tl.2021.desc':  'MicroStrategy, Tesla, and Square added Bitcoin to their balance sheets. El Salvador made it legal tender — the first nation to do so. Bitcoin peaked above $68,000. A new era had begun.',
    'tl.2024.title': 'The ETF Era',
    'tl.2024.desc':  'The SEC approved Bitcoin spot ETFs in January, opening the floodgates for retail and institutional capital. BlackRock, Fidelity and other giants entered the arena. Bitcoin broke all-time highs once again.',

    // Technology
    'tech.label':  'Chapter 03 — The Machine',
    'tech.title1': 'How Does It',
    'tech.title2': 'Work?',
    'tech.desc':   'Four pillars that make Bitcoin unlike anything the world had seen before.',

    // Pillars
    'pillar.decentralization.title': 'Decentralization',
    'pillar.decentralization.desc':  'No central authority controls Bitcoin. It runs on thousands of nodes distributed worldwide — censorship-resistant by design.',
    'pillar.blockchain.title':       'Blockchain',
    'pillar.blockchain.desc':        'Every transaction is recorded on an immutable public ledger. Transparent, permanent, and verifiable by anyone on Earth.',
    'pillar.pow.title':              'Proof of Work',
    'pillar.pow.desc':               'Miners compete to solve cryptographic puzzles, securing the network and earning newly minted Bitcoin as a reward.',
    'pillar.halving.title':          'The Halving',
    'pillar.halving.desc':           'Every ~4 years, the mining reward is cut in half. This controlled scarcity mimics gold — and drives Bitcoin\'s long-term price cycles.',

    'tech.rule.title':       'The 21 Million Rule',
    'tech.rule.text':        'There will never be more than 21,000,000 Bitcoin in existence. This hard cap — baked into the protocol\'s code — is what makes Bitcoin the hardest money ever created. No inflation. No exceptions. No central bank can change it.',
    'tech.supply.mined':     'Mined: ~19.7M',
    'tech.supply.remaining': 'Remaining: ~1.3M',

    // Impact
    'impact.label':  'Chapter 04 — The Legacy',
    'impact.title1': 'A Revolution',
    'impact.title2': 'Still Unfolding',

    'impact.inclusion.title':     'Financial Inclusion',
    'impact.inclusion.desc':      'Over 1.4 billion adults worldwide remain unbanked. Bitcoin requires only a smartphone and internet access — no ID, no credit history, no branch visit. For the first time, anyone can participate in the global economy on equal terms.',
    'impact.sovereignty.title':   'Monetary Sovereignty',
    'impact.sovereignty.desc':    'Citizens in countries with hyperinflation — Venezuela, Argentina, Lebanon, Zimbabwe — turned to Bitcoin as their savings were destroyed. It became not just an investment, but a lifeline.',
    'impact.institutional.title': 'Institutional Capital',
    'impact.institutional.desc':  'From hedge funds to sovereign wealth funds, the world\'s largest financial institutions now hold or offer Bitcoin exposure. The narrative shifted from "internet money" to "digital gold" to "reserve asset."',
    'impact.tech.title':          'Technological Legacy',
    'impact.tech.desc':           'Bitcoin\'s blockchain technology ignited an entire ecosystem — smart contracts, DeFi, NFTs, and more. Whether you love or hate them, none would exist without Satoshi\'s original insight.',

    // CTA
    'cta.title': 'The story is still being written.',
    'cta.sub':   'Every block mined adds a new chapter. The revolution is ongoing.',
    'cta.btn':   'Read the Full Timeline',

    // Footer
    'footer.note':   'An educational archive dedicated to the history, technology, and impact of Bitcoin. Not financial advice. Not investment advice. Just the truth about a revolution.',
    'footer.block':  'Block height:',
    'footer.prices': 'Prices via CoinGecko API',

    // Market
    'market.connecting':      'Connecting to live feed...',
    'market.live':            'LIVE',
    'market.connecting_badge':'CONNECTING...',
    'market.updated':         'Last updated:',
    'market.marketcap':       'Market Cap',
    'market.volume':          'Volume 24h',
    'market.btcprice':        'BTC Price',
    'market.change':          'Change 24h',
    'market.history':         'Price History',

    'market.alerts.label':      'Price Alerts',
    'market.alerts.title1':     'Get notified when',
    'market.alerts.title2':     'Bitcoin moves.',
    'market.alerts.desc':       'Set a price target and we\'ll send you an email the moment Bitcoin crosses it. No account needed.',
    'market.alerts.success':    '✓ Alert registered! You\'ll receive an email when your target is reached.',
    'market.alerts.email':      'Email',
    'market.alerts.price':      'Target Price (USD)',
    'market.alerts.condition':  'Condition',
    'market.alerts.above':      'Price goes above',
    'market.alerts.below':      'Price falls below',
    'market.alerts.btn':        'Set Alert',
    'market.alerts.registering':'Registering...',
    'market.alerts.error':      'Failed to register alert. Please try again.',
  }
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private langSubject = new BehaviorSubject<Lang>('pt');
  lang$ = this.langSubject.asObservable();

  get currentLang(): Lang {
    return this.langSubject.value;
  }

  toggle(): void {
    this.langSubject.next(this.currentLang === 'pt' ? 'en' : 'pt');
  }

  setLang(lang: Lang): void {
    this.langSubject.next(lang);
  }

  t(key: string): string {
    const dict = translations[this.currentLang] as Record<string, string>;
    return dict[key] ?? key;
  }
}
