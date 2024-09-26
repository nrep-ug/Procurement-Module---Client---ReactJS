// src/hooks/usePreloadResources.js

import { useState, useEffect } from 'react'

const usePreloadResources = (resources = []) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadResources = async () => {
            const promises = resources.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image()
                    img.src = src
                    img.onload = resolve
                    img.onerror = reject
                })
            })

            try {
                await Promise.all(promises)
                setLoading(false)
            } catch (error) {
                console.error('Failed to load resources:', error)
                setLoading(false) // Fallback to show content even if some resources fail
            }
        }

        loadResources()
    }, [resources])

    return loading
}

export default usePreloadResources