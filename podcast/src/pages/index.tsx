import { useEffect } from "react"


export default function Home(props) {
  
  return (
   <h1>Index</h1>
  
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

    export async function getStaticProps() {
      const response = await fetch('http://localhost:3333/episodes')
      const data = await response.json()
      
      return {
        props: {
          episodes: data,
        },
        revalidate: 60 * 60 * 8,
      }
      
    }
