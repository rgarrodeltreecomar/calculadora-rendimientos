import { Global} from '@emotion/react'
import { globalStyles } from './styles/global'
import { LandingPage } from './page'

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      < LandingPage/>
    </>
  )
}

export default App