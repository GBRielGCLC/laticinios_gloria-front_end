import { useCallback, useEffect, useState } from "react";
import {
    IFiltroUsuario,
    IListarUsuariosProps,
    IUsuario,
    IUsuarioGET,
    UsuarioService
} from "../../Services/Api/Usuario";
import { toast } from "react-toastify";
import {
    GridColDef,
    GridPaginationModel,
    GridRenderCellParams
} from "@mui/x-data-grid";
import { ActionButtons } from "../../Components/PersonalizedDataGrid/ActionButtons";
import { useConfirm } from "../../Contexts";
import { defaultPaginationsData } from "../../Services/Api/Utils";

export const useUsuario = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUsuario | null>(null);

    const [isLoadingUsuario, setIsLoadingUsuario] = useState(false);

    const [usuarios, setUsuarios] = useState<IUsuarioGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });

    const [pagination, setPagination] = useState(defaultPaginationsData);

    const confirmDialog = useConfirm();

    /* =======================
       COLUNAS DO GRID
    ======================= */
    const columns: GridColDef<IUsuario>[] = [
        {
            field: 'nome',
            headerName: 'Nome',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'email',
            headerName: 'E-mail',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'funcao',
            headerName: 'Função',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'ativo',
            headerName: 'Ativo',
            flex: 0.5,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (value: boolean) => value ? 'Sim' : 'Não',
        },
        {
            field: 'actions',
            headerName: 'Ações',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => ActionButtons({
                params,
                onEdit: handleEditUser,
                onDelete: () => {
                    confirmDialog({
                        titulo: 'Excluir Usuário',
                        conteudo: 'Tem certeza que deseja excluir este usuário?',
                        onConfirm: ({ close, setLoading }) =>
                            handleDeleteUsuario({
                                id: params.row.id,
                                setLoading,
                                close
                            })
                    });
                },
            }),
        },
    ];

    /* =======================
       LISTAGEM
    ======================= */
    const listAllUsuarios = useCallback((query?: IListarUsuariosProps) => {
        setIsLoadingUsuario(true);

        if (!query) query = {};
        if (!query.pagination) query.pagination = pagination;
        if (!query.filtros) query.filtros = filtros;

        UsuarioService.listarUsuarios(query).then((result) => {
            setIsLoadingUsuario(false);

            if (result instanceof Error) {
                setUsuarios({
                    dados: [],
                    totalPaginas: 0,
                    totalRegistros: 0
                });
                toast.error(result.message);
                return;
            }

            setUsuarios(result);
        });
    }, []);

    useEffect(() => {
        listAllUsuarios({ pagination, filtros });
    }, []);

    /* =======================
       PAGINAÇÃO
    ======================= */
    const handlePageChange = (model: GridPaginationModel) => {
        const modelPagination = {
            pagina: model.page + 1,
            tamanhoPagina: model.pageSize
        };

        setPagination(modelPagination);
        listAllUsuarios({ pagination: modelPagination, filtros });
    };

    /* =======================
       FORM
    ======================= */
    const handleEditUser = (usuario: IUsuario) => {
        setEditingUser(usuario);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);

        // GARANTIR QUE O MODAL FECHE ANTES DE RESETAR OS DADOS
        setTimeout(() => setEditingUser(null), 500);
    };

    /* =======================
       DELETE
    ======================= */
    interface HandleDeleteUsuarioProps {
        id: number;
        setLoading: (v: boolean) => void;
        close: () => void;
    }

    const handleDeleteUsuario = (props: HandleDeleteUsuarioProps) => {
        props.setLoading(true);

        UsuarioService.excluirUsuario(props.id).then((result) => {
            props.setLoading(false);

            if (result instanceof Error) {
                toast.error(result.message);
                return;
            }

            toast.success("Usuário excluído com sucesso!");
            listAllUsuarios({ pagination, filtros });
            props.close();
        });
    };

    /* =======================
       FILTRO
    ======================= */
    const [openFiltro, setOpenFiltro] = useState(false);
    const [filtros, setFiltros] = useState<IFiltroUsuario>();

    const handleFiltrar = (filter: IFiltroUsuario) => {
        setFiltros(filter);
        listAllUsuarios({ filtros: filter, pagination });
        setOpenFiltro(false);
    };

    return {
        listAllUsuarios,
        usuarios,
        isLoadingUsuario,
        columns,

        pagination,
        handlePageChange,

        isFormOpen,
        setIsFormOpen,
        editingUser,
        handleCloseForm,

        openFiltro,
        setOpenFiltro,
        filtros,
        handleFiltrar,
    };
};
