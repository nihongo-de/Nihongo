export type AdjGroup = 'i' | 'na'

export interface Adjective {
  /** Grundform in Ruby-Syntax, な-Adjektive ohne な: 静[しず]か */
  jp: string
  de: string
  group: AdjGroup
}

const a = (jp: string, group: AdjGroup, de: string): Adjective => ({ jp, group, de })

export const adjectivesN5: Adjective[] = [
  a('大[おお]きい', 'i', 'groß'),
  a('小[ちい]さい', 'i', 'klein'),
  a('新[あたら]しい', 'i', 'neu'),
  a('古[ふる]い', 'i', 'alt'),
  a('高[たか]い', 'i', 'teuer, hoch'),
  a('安[やす]い', 'i', 'billig'),
  a('長[なが]い', 'i', 'lang'),
  a('短[みじか]い', 'i', 'kurz'),
  a('暑[あつ]い', 'i', 'heiß'),
  a('寒[さむ]い', 'i', 'kalt'),
  a('忙[いそが]しい', 'i', 'beschäftigt'),
  a('楽[たの]しい', 'i', 'macht Spaß'),
  a('面白[おもしろ]い', 'i', 'interessant'),
  a('難[むずか]しい', 'i', 'schwierig'),
  a('おいしい', 'i', 'lecker'),
  a('広[ひろ]い', 'i', 'geräumig'),
  a('遠[とお]い', 'i', 'weit weg'),
  a('早[はや]い', 'i', 'früh'),
  a('若[わか]い', 'i', 'jung'),
  a('悪[わる]い', 'i', 'schlecht'),
  a('いい', 'i', 'gut'),
  a('静[しず]か', 'na', 'ruhig'),
  a('元気[げんき]', 'na', 'munter, gesund'),
  a('好[す]き', 'na', 'mögen'),
  a('上手[じょうず]', 'na', 'gut in etwas'),
  a('下手[へた]', 'na', 'schlecht in etwas'),
  a('有名[ゆうめい]', 'na', 'berühmt'),
  a('便利[べんり]', 'na', 'praktisch'),
  a('暇[ひま]', 'na', 'frei, Zeit haben'),
  a('親切[しんせつ]', 'na', 'freundlich'),
  a('大切[たいせつ]', 'na', 'wichtig'),
  a('にぎやか', 'na', 'belebt'),
  a('きれい', 'na', 'schön, sauber'),
  a('嫌[きら]い', 'na', 'nicht mögen')
]
