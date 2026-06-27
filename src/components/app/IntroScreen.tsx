import { ImagePlus, Play, ShieldCheck, Shuffle, PiggyBank } from 'lucide-react';
import { FC } from 'react';
import { initialState } from '../../store/state';
import { SvgRenderer } from '../preview/SvgRenderer';
import styles from './IntroScreen.module.css';

interface Props {
  onStart: () => void;
}

const featureItems = [
  {
    title: '簡単操作',
    text: '画像を選んで、配置や余白、背景色などを調整するだけで、すぐにタイル状の画像を作れます。',
    Icon: ImagePlus,
  },
  {
    title: 'ブラウザ内で処理',
    text: '画像作成はあなたの端末上で行われます。外部に送信されることはありません。',
    Icon: ShieldCheck,
  },
  {
    title: '無料・アカウント登録なし・広告なし',
    text: '全機能が無料で利用可能。わずらわしい広告もありません。',
    Icon: PiggyBank,
  },
  {
    title: '商用利用OK',
    text: '作成した画像はPNG形式で保存できます。SNSでの利用や商用利用も自由に行えます。',
    Icon: Shuffle,
  },
];

export const IntroScreen: FC<Props> = ({ onStart }) => {
  return (
    <main className={styles.container}>
      <section className={styles.hero} aria-labelledby="intro-title">
        <div className={styles.copy}>
          <p className={styles.kicker}>TileLoop</p>
          <h1 className={styles.title} id="intro-title">
            画像を
            <wbr />
            まとめて、
            <wbr />
            タイル状の
            <wbr />
            1枚の画像に。
          </h1>
          <p className={styles.lead}>
            並べたい画像を選ぶだけ！ かわいくてシンプルなUIで、簡単にタイル状の画像を作成できるWebツール。
          </p>

          <div className={styles.actions}>
            <button className={styles.primaryButton} type="button" onClick={onStart}>
              <Play className={styles.buttonIcon} aria-hidden="true" strokeWidth={2.5} />
              はじめる
            </button>
          </div>
        </div>

        <div className={styles.previewPanel} aria-label="TileLoopで作成できる画像の例">
          <div className={styles.previewFrame}>
            <div className={styles.previewScale}>
              <SvgRenderer parameter={initialState.renderParameter} />
            </div>
          </div>
          <p className={styles.previewCaption}>こういう画像が作れます</p>
        </div>
      </section>

      <section className={styles.features} aria-label="TileLoopの特徴">
        {featureItems.map((item) => {
          const Icon = item.Icon;

          return (
            <article className={styles.featureCard} key={item.title}>
              <Icon className={styles.featureIcon} aria-hidden="true" strokeWidth={2.2} />
              <h2 className={styles.featureTitle}>{item.title}</h2>
              <p className={styles.featureText}>{item.text}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
};
