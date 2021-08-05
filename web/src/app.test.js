import React from 'react'
import {render, screen} from '@testing-library/react'

const SomeComponent = () => {
    return <p>Hello world!</p>
}

test("header renders", async () => {
    render(<SomeComponent />)
    await screen.findByText("Hello world!")
})
