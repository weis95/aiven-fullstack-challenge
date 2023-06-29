import styled, { css } from 'styled-components'

interface Props {
  direction?: string
  justify?: string
  padding?: string
  align?: string
  width?: number
  margin?: string
  height?: string
}

export const Box = styled.div<Props>`
  display: flex;
  justify-content: ${(props) => props.justify};
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) => props.align};
  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding};
    `};

  ${(props) =>
    props.margin &&
    css`
      margin: ${props.margin};
    `};

  ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `};

  ${(props) =>
    props.width &&
    css`
      width: ${props.width}%;
    `};
`
