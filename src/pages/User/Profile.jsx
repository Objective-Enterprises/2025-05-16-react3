import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

function buildFormState(user) {
	return {
		name: user?.name ?? '',
		email: user?.email ?? '',
		bio: user?.bio ?? '',
		location: user?.location ?? '',
		website: user?.website ?? '',
	};
}

export default function Profile() {
	const navigate = useNavigate();
	const { user, updateUser } = useAuth();
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState(() => buildFormState(user));

	useEffect(() => {
		setForm(buildFormState(user));
	}, [user]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}));
	};

	const handleSave = (event) => {
		event.preventDefault();
		updateUser({ ...user, ...form });
		setEditing(false);
	};

	const handleCancel = () => {
		setForm(buildFormState(user));
		setEditing(false);
	};

	const displayName = form.name || user?.name || '';
	const avatarInitial = displayName.trim().charAt(0).toUpperCase() || 'U';

	return (
		<div className="profile-page">
			<Container className="profile-container">
				<Card className="border-0 rounded-4 shadow-sm profile-card">
					<Card.Body className="p-4 p-lg-5">
						<div className="profile-toolbar">
							<Button variant="outline-secondary" onClick={() => navigate('/home')}>
								Back to home
							</Button>
							<Button
								variant={editing ? 'outline-primary' : 'primary'}
								onClick={() => {
									if (editing) {
										handleCancel();
										return;
									}

									setEditing(true);
								}}
							>
								{editing ? 'Hide Edit Profile' : 'Edit Profile'}
							</Button>
						</div>

						<div className="profile-header">
							<div className="profile-avatar" aria-hidden="true">
								{avatarInitial}
							</div>
							<div>
								<p className="profile-kicker">Your account</p>
								<h1 className="profile-title">{displayName || 'Unnamed User'}</h1>
								<p className="profile-subtitle">Manage your public profile details.</p>
							</div>
						</div>

						{editing ? (
							<Form onSubmit={handleSave} className="profile-form">
								<Row className="g-3">
									<Col md={6}>
										<Form.Group controlId="profile-name">
											<Form.Label>Name</Form.Label>
											<Form.Control
												name="name"
												type="text"
												value={form.name}
												onChange={handleChange}
												placeholder="Enter your name"
											/>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group controlId="profile-email">
											<Form.Label>Email</Form.Label>
											<Form.Control name="email" type="email" value={form.email} disabled />
										</Form.Group>
									</Col>
									<Col xs={12}>
										<Form.Group controlId="profile-bio">
											<Form.Label>Bio</Form.Label>
											<Form.Control
												as="textarea"
												rows={4}
												name="bio"
												value={form.bio}
												onChange={handleChange}
												placeholder="Tell people a bit about yourself"
											/>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group controlId="profile-location">
											<Form.Label>Location</Form.Label>
											<Form.Control
												name="location"
												type="text"
												value={form.location}
												onChange={handleChange}
												placeholder="City, country"
											/>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group controlId="profile-website">
											<Form.Label>Website</Form.Label>
											<Form.Control
												name="website"
												type="url"
												value={form.website}
												onChange={handleChange}
												placeholder="https://example.com"
											/>
										</Form.Group>
									</Col>
								</Row>

								<div className="profile-actions">
									<Button type="submit" variant="primary">
										Save Profile
									</Button>
									<Button type="button" variant="light" onClick={handleCancel}>
										Cancel
									</Button>
								</div>
							</Form>
						) : (
							<div className="profile-details">
								<div className="profile-detail-item">
									<span className="profile-detail-label">Name</span>
									<span className="profile-detail-value">{user?.name || 'Not provided'}</span>
								</div>
								<div className="profile-detail-item">
									<span className="profile-detail-label">Email</span>
									<span className="profile-detail-value">{user?.email || 'Not provided'}</span>
								</div>
								<div className="profile-detail-item">
									<span className="profile-detail-label">Bio</span>
									<span className="profile-detail-value">{user?.bio || 'Not provided'}</span>
								</div>
								<div className="profile-detail-item">
									<span className="profile-detail-label">Location</span>
									<span className="profile-detail-value">{user?.location || 'Not provided'}</span>
								</div>
								<div className="profile-detail-item">
									<span className="profile-detail-label">Website</span>
									<span className="profile-detail-value">{user?.website || 'Not provided'}</span>
								</div>
							</div>
						)}
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
}
