import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function TaskPageSkeleton() {
	return (
		<div className="container mx-auto p-4 md:p-8 space-y-6">
			<div className="flex items-center justify-between space-y-2">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-10 w-36" />
			</div>
			<div className="flex items-center justify-between space-x-2">
				<Skeleton className="h-10 w-full max-w-sm" />
				<Skeleton className="h-10 w-[180px]" />
			</div>
			<div className="rounded-lg border shadow-sm">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[400px]">
								<Skeleton className="h-5 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-5 w-16" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-5 w-20" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-5 w-20" />
							</TableHead>
							<TableHead className="text-right">
								<Skeleton className="h-5 w-16" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(5)].map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className="h-5 w-3/4" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-24" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-20" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-24" />
								</TableCell>
								<TableCell className="text-right">
									<Skeleton className="h-8 w-16" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex justify-center">
				<Skeleton className="h-10 w-48" />
			</div>
		</div>
	);
}
