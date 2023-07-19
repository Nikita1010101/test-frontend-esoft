import { AxiosResponse } from 'axios'
import { useQuery } from '@tanstack/react-query'

import { IFlat } from 'types/flat.type'
import { IUseFlats } from 'types/hook.type'
import { createQueryParams } from 'utils/create-query-params'
import { useTypedSelector } from './use-typed-selector'
import { useActions } from './use-actions'
import { FlatService } from 'services/flat.service'

import { initialState as bodyInitialState } from '@/store/slices/filters-body/filters-body.slice'

export const useAllFlats = (): IUseFlats => {
	const {
		query_params: { current_page, sort_name, sort_type }
	} = useTypedSelector(state => state)
	const { getFlatsCount } = useActions()

	const query_params = createQueryParams(current_page, sort_name, sort_type)

	const queryKeys: readonly unknown[] = [current_page, sort_name, sort_type]

	const { data: flats, isLoading: is_loading } = useQuery<
		AxiosResponse<IFlat[]>,
		unknown,
		IFlat[],
		readonly unknown[]
	>({
		queryKey: ['flats', ...queryKeys],
		queryFn: () => FlatService.getAllFlats(query_params),
		select: ({ data }) => data
	})

	if (typeof window !== 'undefined') {
		getFlatsCount(bodyInitialState)
	}

	return { flats, is_loading }
}
