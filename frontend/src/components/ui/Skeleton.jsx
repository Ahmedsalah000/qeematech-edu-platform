const Skeleton = ({ className = '', ...props }) => {
    return (
        <div
            className={`skeleton ${className}`}
            {...props}
        />
    )
}

export const CardSkeleton = () => (
    <div className="card">
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
    </div>
)

export const TableRowSkeleton = () => (
    <tr>
        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
        <td className="p-4"><Skeleton className="h-4 w-32" /></td>
        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
        <td className="p-4"><Skeleton className="h-4 w-16" /></td>
    </tr>
)

export default Skeleton
