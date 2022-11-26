import renderer from 'react-test-renderer';
import Footer from '../Footer';

it('does', () => {
	const component = renderer.create(<Footer />);
	
	expect(component.toJSON()).toMatchSnapshot();
});
