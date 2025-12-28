import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsAPI } from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import { Users, Plus, Edit, Trash2, Search, User, Mail, Phone, GraduationCap, Calendar, Lock } from 'lucide-react'

const StudentsPage = () => {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        class: '',
        academicYear: '',
    })

    // Fetch students
    const { data: students = [], isLoading } = useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            const res = await studentsAPI.getAll()
            return res.data
        }
    })

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => studentsAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            closeModal()
        }
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => studentsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
            closeModal()
        }
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => studentsAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] })
        }
    })

    const openModal = (student = null) => {
        if (student) {
            setEditingStudent(student)
            setFormData({
                name: student.name,
                email: student.email,
                password: '',
                phone: student.phone || '',
                class: student.class || '',
                academicYear: student.academicYear || '',
            })
        } else {
            setEditingStudent(null)
            setFormData({ name: '', email: '', password: '', phone: '', class: '', academicYear: '' })
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingStudent(null)
        setFormData({ name: '', email: '', password: '', phone: '', class: '', academicYear: '' })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { ...formData }
        // Don't send empty password on update
        if (editingStudent && !data.password) {
            delete data.password
        }
        if (editingStudent) {
            updateMutation.mutate({ id: editingStudent.id, data })
        } else {
            createMutation.mutate(data)
        }
    }

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            deleteMutation.mutate(id)
        }
    }

    // Filter students
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3 min-w-0">
                        <Users className="text-[var(--primary)] shrink-0" />
                        Students Management
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Manage your school students
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                    <Button onClick={() => openModal()} className="w-full sm:w-auto justify-center">
                        <Plus size={18} />
                        Add Student
                    </Button>
                </div>
            </div>

            {/* Students Table */}
            <Card hover={false} className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-secondary)]">
                            <tr>
                                <th className="text-left p-4 text-[var(--text-secondary)] font-medium">Name</th>
                                <th className="hidden md:table-cell text-left p-4 text-[var(--text-secondary)] font-medium">Email</th>
                                <th className="hidden lg:table-cell text-left p-4 text-[var(--text-secondary)] font-medium">Class</th>
                                <th className="hidden xl:table-cell text-left p-4 text-[var(--text-secondary)] font-medium">Academic Year</th>
                                <th className="text-right p-4 text-[var(--text-secondary)] font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-[var(--bg-secondary)]/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center shrink-0">
                                                    <User size={18} className="text-[var(--text-muted)]" />
                                                </div>
                                                <span className="font-medium text-[var(--text-primary)] truncate">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell p-4 text-[var(--text-secondary)]">
                                            <span className="block max-w-[320px] truncate">{student.email}</span>
                                        </td>
                                        <td className="hidden lg:table-cell p-4">
                                            <span className="badge">{student.class || 'N/A'}</span>
                                        </td>
                                        <td className="hidden xl:table-cell p-4 text-[var(--text-secondary)]">{student.academicYear || 'N/A'}</td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openModal(student)}>
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(student.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingStudent ? 'Edit Student' : 'Add New Student'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        icon={User}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email"
                        icon={Mail}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={!!editingStudent}
                    />
                    <Input
                        label={editingStudent ? "New Password (leave empty to keep current)" : "Password"}
                        icon={Lock}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingStudent}
                    />
                    <Input
                        label="Phone"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Input
                        label="Class"
                        icon={GraduationCap}
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    />
                    <Input
                        label="Academic Year"
                        icon={Calendar}
                        value={formData.academicYear}
                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                            {editingStudent ? 'Update' : 'Add'} Student
                        </Button>
                        <Button type="button" variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default StudentsPage
