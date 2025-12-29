import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonsAPI } from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import Rating from '../../components/ui/Rating'
import { BookOpen, Plus, Edit, Trash2, Search, Image } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
}

const LessonsPage = () => {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingLesson, setEditingLesson] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        rating: 0,
    })
    const [imageFile, setImageFile] = useState(null)

    // Fetch lessons
    const { data: lessons = [], isLoading } = useQuery({
        queryKey: ['adminLessons'],
        queryFn: async () => {
            const res = await lessonsAPI.getAll()
            return res.data
        }
    })

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => lessonsAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminLessons'] })
            closeModal()
        }
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => lessonsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminLessons'] })
            closeModal()
        }
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => lessonsAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminLessons'] })
        }
    })

    const openModal = (lesson = null) => {
        if (lesson) {
            setEditingLesson(lesson)
            setFormData({
                name: lesson.name,
                description: lesson.description || '',
                rating: lesson.rating || 0,
            })
        } else {
            setEditingLesson(null)
            setFormData({ name: '', description: '', rating: 0 })
        }
        setImageFile(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingLesson(null)
        setFormData({ name: '', description: '', rating: 0 })
        setImageFile(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { ...formData }
        if (imageFile) {
            data.image = imageFile
        }
        if (editingLesson) {
            updateMutation.mutate({ id: editingLesson.id, data })
        } else {
            createMutation.mutate(data)
        }
    }

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            deleteMutation.mutate(id)
        }
    }

    // Filter lessons
    const filteredLessons = lessons.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3 min-w-0">
                        <BookOpen className="text-[var(--primary)] shrink-0" />
                        Lessons Management
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Create and manage lessons
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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
                        Add Lesson
                    </Button>
                </div>
            </div>

            {/* Lessons Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-40 skeleton mb-4" />
                            <div className="h-6 skeleton w-3/4 mb-2" />
                            <div className="h-4 skeleton w-full" />
                        </div>
                    ))}
                </div>
            ) : filteredLessons.length === 0 ? (
                <Card hover={false} className="text-center py-16">
                    <BookOpen size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">No lessons found</h3>
                    <p className="text-[var(--text-secondary)]">Start by adding your first lesson</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson) => (
                        <Card key={lesson.id} className="overflow-hidden group">
                            {/* Image */}
                            <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden bg-[var(--bg-secondary)]">
                                {lesson.image ? (
                                    <img
                                        src={getImageUrl(lesson.image)}
                                        alt={lesson.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Image size={40} className="text-[var(--text-muted)]" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">{lesson.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                {lesson.description || 'No description'}
                            </p>
                            <Rating value={lesson.rating} />

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
                                <Button variant="secondary" size="sm" className="flex-1" onClick={() => openModal(lesson)}>
                                    <Edit size={16} />
                                    Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(lesson.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Lesson Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="label">Description</label>
                        <textarea
                            rows={4}
                            className="input resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter lesson description..."
                        />
                    </div>

                    <div>
                        <label className="label">Rating (0-5)</label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            className="input"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                        />
                    </div>

                    <div>
                        <label className="label">Lesson Image</label>
                        <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                            <div className="pointer-events-none">
                                <Image size={32} className="mx-auto text-[var(--text-muted)] mb-2" />
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {imageFile ? imageFile.name : 'Click to upload image'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                            {editingLesson ? 'Update' : 'Add'} Lesson
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

export default LessonsPage
