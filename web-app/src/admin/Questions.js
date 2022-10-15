import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import './DataTableDemo.css';
import QuestionsService from './service/QuestionService';

const Questions = () => {
    const [questions, setQuestions] = useState(null);

    const [filters, setFilters] = useState({
        'category': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'questions': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'status': { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        QuestionsService.fetchQuestions().then(data => { setQuestions(data); setLoading(false) });
    }, []);

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    // const dateBodyTemplate = (rowData) => {
    //     return formatDate(rowData.date);
    // }

    // const dateFilterTemplate = (options) => {
    //     return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    // }

    const categoryBodyTemplate = (rowData) => {
        return <Tag value={ rowData.category } />;
    }
    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', {'true-icon pi-check-circle': rowData.status, 'false-icon pi-times-circle': !rowData.status })}></i>;
    }

    const statusRowFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />
    }

    const questionBodyTemplate = (rowData) => {
        return (
            <div>
            { rowData.questions[0] }
            {
                rowData.questions.length > 0 ? (
                    <Chip label={ `+${ rowData.questions.length - 1 }` } style={{ transform: 'scale(0.8)', marginLeft: '.5rem' }} />
                ) : null
            }
            </div>
        )
    }

    return (
        <div>
            {/* <div className="card"> */}
                <DataTable value={questions} paginator className="p-datatable-questions" rows={5}
                    dataKey="id" filters={filters} filterDisplay="row" loading={loading} responsiveLayout="scroll"
                    emptyMessage="No questions found.">
                    <Column field="category" body={categoryBodyTemplate} header="Category" filter filterPlaceholder="Search by category" style={{ width: '30rem' }} />
                    <Column field="questions" body={questionBodyTemplate} header="Question" filter filterPlaceholder="Search by question" style={{ minWidth: '1rem', maxWidth: '15rem' }} />
                    <Column field="status" dataType="boolean" header="Answered" style={{ minWidth: '1rem', maxWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                </DataTable>
            {/* </div> */}
        </div>
    );
}

export default Questions