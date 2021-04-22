// import { useEffect } from "react"
import { GetStaticProps } from 'next';
import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationTotimeString } from '../utils/convertDurationTotimeString';

type Episodes= {
  episodes: Array<{
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    duration: string;
    durantionAsString: string;
    url: string;
    members: string;
    published_at: string;
  }>
}

type HomeProps = {
  episodes: Episodes[];
}


export default function Home(props: HomeProps) {
  
  return (
    <>
   <h1>Index</h1>
   <h1>{JSON.stringify(props.episodes)}</h1>
   </>
  
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
      
      
      return {
        props: {
          episodes,
        },
        revalidate: 60 * 60 * 8,
      }
      
    }
