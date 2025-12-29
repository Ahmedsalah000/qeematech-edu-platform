import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { User, Phone, GraduationCap, Calendar, Camera } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
}

const ProfilePage = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        class: '',
        academicYear: '',
    })
    const [imageFile, setImageFile] = useState(null)

    // Fetch profile
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await profileAPI.get()
            return res.data
        }
    })

    // Sync form data when profile is loaded
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                class: profile.class || '',
                academicYear: profile.academicYear || '',
            })
        }
    }, [profile])

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data) => profileAPI.updateStudent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            setIsEditing(false)
            setImageFile(null)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { ...formData }
        if (imageFile) {
            data.profileImage = imageFile
        }
        updateMutation.mutate(data)
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-40 skeleton rounded-xl" />
                <div className="h-60 skeleton rounded-xl" />
            </div>
        )
    }

    return (
        <div className="animate-fadeIn max-w-2xl">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <User className="text-[var(--primary)]" />
                My Profile
            </h1>

            {/* Profile Card */}
            <Card hover={false} className="mb-6">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
                            {profile?.profileImage ? (
                                <img
                                    src={getImageUrl(profile.profileImage)}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User size={40} className="text-[var(--text-muted)]" />
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--primary)] cursor-pointer hover:bg-[var(--primary-hover)] transition-colors">
                                <Camera size={16} className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                />
                            </label>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">{profile?.name}</h2>
                        <p className="text-[var(--text-secondary)]">{profile?.email}</p>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            {profile?.school?.name || 'No school assigned'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Edit Form */}
            <Card hover={false}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        icon={User}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        readOnly={!isEditing}
                    />

                    <Input
                        label="Phone Number"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        readOnly={!isEditing}
                    />

                    <Input
                        label="Class"
                        icon={GraduationCap}
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        readOnly={!isEditing}
                    />

                    <Input
                        label="Academic Year"
                        icon={Calendar}
                        value={formData.academicYear}
                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                        readOnly={!isEditing}
                    />

                    <div className="flex gap-3 pt-4">
                        {isEditing ? (
                            <>
                                <Button type="submit" isLoading={updateMutation.isPending}>
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button type="button" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default ProfilePage
