import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField'; 
import styled from '@emotion/styled';
import { useQuery } from 'react-query';
import { debounce } from 'lodash';
import TableHeader from './tableHeader';
import TableRowComponent from './tableRow';
import TablePagination from './tablePagination';
import { fetchTableData } from '../../common/api/people/fetchTableData';


const Container = styled.div`

`;

enum TableHeaderEnum {
    NAME = 'Name',
    GENDER = 'Gender',
    HEIGHT = 'Height',
    EYE_COLOR = 'Eye Color',
}

const PeopleTable: React.FC = () => {
    const columns: string[] = [TableHeaderEnum.NAME, TableHeaderEnum.GENDER, TableHeaderEnum.HEIGHT, TableHeaderEnum.EYE_COLOR, ''];

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setCurrentSearch] = useState('');

    const { data, isLoading, isError, refetch, isFetching  } = useQuery(['tableData', currentPage], () => fetchTableData(currentPage, search), {
        enabled: true,
      });

    const pagesCount = Math.ceil(data?.count / 10) || 1;

    const handleLoadMore = (page: number) => {
        setCurrentPage(page);
        refetch();
    };
    const debouncedSearchChange = debounce(() => {
        refetch();
    }, 200); 

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setCurrentSearch(searchTerm);

        debouncedSearchChange();
    };


    if (isError) {
        return <Container>Error loading data</Container>;
    }

    return (
        <Container>
            <div>
            <TableContainer component={Paper}>
                <TextField
                    label="Search By Name"
                    value={search}
                    variant='standard'
                    onChange={handleSearchChange}
                />
                                {isLoading || isFetching && <div>Loading...</div>}

                <Table sx={{ minWidth: 1000 }} aria-label="simple table">
                    <TableHead>
                        <TableHeader columns={columns} />
                    </TableHead>
                    <TableBody>
                        {data?.results.map((row: { name: unknown; gender?: string; height?: string; eye_color?: string; }) => (
                            <TableRowComponent key={`id${row.name}`} data={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handleLoadMore} />
            </div>
        </Container>
    );
};

export default PeopleTable;
