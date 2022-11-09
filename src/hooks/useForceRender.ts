import { useCallback, useState } from "react"

const useForceRender = () => {
   const [forceRenderCount, setForceRenderCount] = useState(0)

   const forceRerender = useCallback(() => setForceRenderCount(prev => prev + 1), [])

   return [
      forceRenderCount,
      forceRerender,
   ] as const
}

export default useForceRender