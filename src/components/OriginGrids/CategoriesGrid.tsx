import { Grid } from '@mui/material'
import { ImageCard } from '../Cards'
import { Categories } from '../../utilities/types'
import { ReactNode } from 'react'

export const CategoriesGrid = ({
    categories,
    firstGridItem,
    fxs = 12,
    fsm = 12,
    fmd = 12,
    flg = 6,
}: {
    categories: Categories
    firstGridItem?: ReactNode
    fxs?: number
    fsm?: number
    fmd?: number
    flg?: number
}) => {
    return (
        <Grid container spacing={{ xs: 2.5, md: '50px' }}>
            {firstGridItem && (
                <Grid item xs={fxs} sm={fsm} md={fmd} lg={flg}>
                    {firstGridItem}
                </Grid>
            )}
            {categories?.map((card, index) => (
                <Grid key={index} item xs={6} sm={4} md={4} lg={3}>
                    <ImageCard ICardData={card} />
                </Grid>
            ))}
        </Grid>
    )
}
