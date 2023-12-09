import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FilterItem, { FilterModelItem } from './FilterItem';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from 'react-i18next';

export interface ColumnsFileds {
    column: string;
    operator: string;
    values: Array<string | number | Date>;
}

interface MultiColumnFilterProps {
    filterModel: Array<FilterModelItem>;
    currentFilters?: Array<ColumnsFileds>;
    setCurrentFilters: Function;
}

const getEmptyFilter = (): ColumnsFileds => ({ column: '', operator: '', values: [] });

export default function MultiColumnFilter(props: MultiColumnFilterProps) {
    const { t } = useTranslation();

    const updateFilters = (filter: ColumnsFileds, idx: number) => {
        const oldFilters = props.currentFilters || [];

        if (idx < 0) {
            console.error("Invalid index in updateFilters", idx);
            return;
        }

        if (idx < oldFilters.length) {
            filter.column && (oldFilters[idx].column = filter.column);
            filter.operator && (oldFilters[idx].operator = filter.operator);
            filter.values && (oldFilters[idx].values = filter.values);
        } else {
            oldFilters.push(filter);
        }

        props.setCurrentFilters([...oldFilters]);
    }

    const deleteFilter = (idx: number) => {
        const oldFilters = props.currentFilters || [];

        if (idx < 0 || idx >= oldFilters.length) {
            console.error("Invalid index in deleteFilter", idx);
            return;
        }

        if (oldFilters.length === 1) {
            oldFilters[0] = { column: '', operator: '', values: [] };
        } else {
            oldFilters.splice(idx, 1);
        }

        props.setCurrentFilters([...oldFilters]);
    }

    return (
        <Box sx={{ width: 300, height: 'auto' }}>
            {
                props.currentFilters?.map((item: ColumnsFileds, index: number) => {
                    return (
                        <FilterItem
                            key={index}
                            index={index}
                            model={props.filterModel}
                            chosenColumn={item.column}
                            chosenOperator={item.operator}
                            values={item.values}
                            updateFilter={updateFilters}
                            deleteFilter={deleteFilter}
                        />
                    );
                })
            }
            <Stack direction="row" spacing={4}>
                <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => updateFilters(getEmptyFilter(), (props.currentFilters?.length ?? 0) + 1)}
                >
                    {t("multi_column_filter_add_filter")}
                </Button>
                <Button
                    variant='text'
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => props.setCurrentFilters([getEmptyFilter()])}
                >
                    {t("multi_column_filter_delete_filters")}
                </Button>
            </Stack>
        </Box>
    );
}
