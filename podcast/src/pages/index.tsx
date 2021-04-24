// import { useEffect } from "react"
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationTotimeString } from '../utils/convertDurationTotimeString';

import styles from './home.module.scss';

type Episode= {
  
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    duration: string;
    durantionAsString: string;
    url: string;
    members: string;
    publishedAt: string;
 
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}


export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  
  return (
  <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2> Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {

            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  objectFit="cover"
                />

                <div className={styles.episodesDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durantionAsString}</span>
                </div>
                <button type="button">
                <img src='/play-green.svg' alt='Tocar episódio'/>
                </button>
              </li>
            )
          })}
        </ul>
      
      </section>
        <section className={styles.allEpisodes}>
      
      </section>
  </div>
  
  )
}
//SPA: useEffect com .then ...
//SSR - vai carregar sempre que alguem acessar, mesmo com o js desabilitado, vai ser carregado pelo nextjs.
    // export async function getServerSideProps() {
    //   const response = await fetch('http://localhost:3333/episodes')
    //   const data = await response.json()
      
    //   return {
    //     props: {
    //       episodes: data,
    //     }
    //   }
      
    // }

//SSG: mas se a home nao sofre alterações com frequencia, não tem pq toda vez que carregar a página chamar a API, por isso tem como gerar uma versão estática de html, qualquer pessoa que acessar vai acessar o mesmo conteudo, deixando a pagina muito mais perfomatica:
//o revalidate é o tempo para atuzaliar a pagina, a cada tanto tempo uma nova versão acessando a api vai ser gerada , no exemplo a cada 8h vai acessar a API.
//essa forma só ocorre em produção, por isso foi criada um build.

    export  const getStaticProps: GetStaticProps = async () => {
      const {data} = await api.get('episodes', {
        params: {
          _limit: 12,
          _sort: 'published_at',
          _order: 'desc'
        }
      })

      const episodes = data.map(episode => {
        return {
          id: episode.id,
          title: episode.title,
          thumbnail: episode.thumbnail,
          members: episode.members,
          publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
          duration: Number(episode.file.duration),
          durantionAsString: convertDurationTotimeString(Number(episode.file.duration)),
          description: episode.description,
          url: episode.file.url,
        }
      })

      const latestEpisodes = episodes.slice(0,2);
      const allEpisodes = episodes.slice(2, episodes.length);
      
      
      return {
        props: {
          latestEpisodes,
          allEpisodes,
        },
        revalidate: 60 * 60 * 8,
      }
      
    }
